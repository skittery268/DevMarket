// DevMarket database seeder
// ---------------------------------------------------------------------------
// Creates 15 categories, a few seller users and ~200 products that strictly
// follow the Mongoose schemas in /server/models.
//
// Usage (from the project root or anywhere):
//   node seed/index.js            seed without touching existing data
//   node seed/index.js --reset    delete ONLY seed-created data, then re-seed
//
// This script never deletes data unless --reset is passed explicitly.
// ---------------------------------------------------------------------------

const path = require("path");

// The models are compiled on the server's own mongoose instance. We MUST connect
// using that exact instance (Product.base) — connecting a different mongoose copy
// would leave the models without a working connection.
const serverDir = path.join(__dirname, "..", "server");

// Load env (MONGO_URI, ...) from the server's .env, resolving dotenv from the
// server's node_modules so this works regardless of the current directory.
require(path.join(serverDir, "node_modules", "dotenv")).config({
    path: path.join(serverDir, ".env")
});

const Category = require(path.join(serverDir, "models", "category.model"));
const Product = require(path.join(serverDir, "models", "product.model"));
const User = require(path.join(serverDir, "models", "user.model"));
const Comment = require(path.join(serverDir, "models", "comment.model"));
const Review = require(path.join(serverDir, "models", "review.model"));
const mongoose = Product.base;

const { categories } = require("./data/categories");
const { productPools } = require("./data/products");
const { sellers } = require("./data/sellers");
const { buyers } = require("./data/buyers");
const { buildProductDocs, randInt, pickSome, weightedRating, buildComment } = require("./helpers");

const RESET = process.argv.includes("--reset");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/devMarket";

const log = (...args) => console.log("[seed]", ...args);

// Ensure seller users exist (find-or-create by email). Uses .save() so the
// password-hashing pre-save hook on the User model runs.
const ensureSellers = async () => {
    const ids = [];
    let created = 0;

    for (const data of sellers) {
        let user = await User.findOne({ email: data.email });
        if (!user) {
            user = new User(data);
            await user.save();
            created++;
        }
        ids.push(user._id);
    }

    log(`Sellers: ${created} created, ${ids.length} total.`);
    return ids;
};

// Ensure categories exist (find-or-create by unique name). On a normal run this
// is idempotent and never overwrites an existing category.
const ensureCategories = async () => {
    const byKey = {};
    let created = 0;

    for (const def of categories) {
        let doc = await Category.findOne({ name: def.name });
        if (!doc) {
            doc = await Category.create({
                name: def.name,
                description: def.description,
                allowedAttributes: def.allowedAttributes,
                image: def.image
            });
            created++;
        }
        // Keep allowedAttributes in memory so products can be validated against them.
        byKey[def.key] = { _id: doc._id, allowedAttributes: def.allowedAttributes };
    }

    log(`Categories: ${created} created, ${categories.length} total.`);
    return byKey;
};

const seedProducts = async (categoriesByKey, sellerIds) => {
    const existing = await Product.countDocuments({
        "universal.sellerId": { $in: sellerIds }
    });

    if (existing > 0 && !RESET) {
        log(`Found ${existing} existing seed products — skipping product creation.`);
        log("Run with --reset to regenerate the product catalog.");
        return 0;
    }

    const docs = buildProductDocs(productPools, categoriesByKey, sellerIds);
    const inserted = await Product.insertMany(docs); // validates against the schema
    log(`Products: ${inserted.length} created.`);
    return inserted.length;
};

// Below this many existing users we cannot give products 3–10 reviews from
// DIFFERENT people, so the buyer pool is created to top things up.
const MIN_REVIEWER_POOL = 15;

// Build the pool of candidate review authors from ALL existing users, creating
// extra buyer accounts ONLY when the existing users are too few. Buyers are
// found-or-created by email (idempotent) via .save() so the password-hashing
// pre-save hook runs.
const ensureReviewers = async () => {
    const existing = await User.find().select("_id").lean();
    let created = 0;

    if (existing.length < MIN_REVIEWER_POOL) {
        for (const data of buyers) {
            const found = await User.findOne({ email: data.email });
            if (!found) {
                await new User(data).save();
                created++;
            }
        }
    }

    const all = await User.find().select("_id").lean();
    const ids = all.map((u) => u._id);

    log(`Reviewers: ${existing.length} existing user(s), ${created} buyer(s) created, ${ids.length} candidate authors total.`);
    return { ids, created, existingCount: existing.length };
};

// Creates 3–10 reviews per seed product, each from a different user with its own
// Comment. Comments are inserted first so their _ids can be referenced by the
// reviews. Everything goes through insertMany to minimise round-trips.
const seedReviews = async (sellerIds, reviewerIds) => {
    // Only review products this seeder owns, so --reset can clean up precisely.
    const products = await Product.find({ "universal.sellerId": { $in: sellerIds } })
        .select("_id universal.sellerId")
        .lean();

    if (products.length === 0) {
        log("Reviews: no seed products found — skipping.");
        return { comments: 0, reviews: 0 };
    }

    const productIds = products.map((p) => p._id);

    const existing = await Review.countDocuments({ productId: { $in: productIds } });
    if (existing > 0 && !RESET) {
        log(`Found ${existing} existing seed reviews — skipping review creation.`);
        log("Run with --reset to regenerate reviews.");
        return { comments: 0, reviews: 0 };
    }

    const usedComments = new Set();
    const usedAuthors = new Set();
    const intents = []; // { authorId, productId, rating, content }
    const reviewCountByProduct = new Map();

    for (const product of products) {
        const sellerId = String(product.universal.sellerId);

        // A user must not review their own product — exclude the product's seller.
        const candidates = reviewerIds.filter((id) => String(id) !== sellerId);
        if (candidates.length === 0) continue;

        // 3–10 distinct reviewers (capped by how many candidates we actually have).
        const target = Math.min(randInt(3, 10), candidates.length);
        const reviewers = pickSome(candidates, target);

        for (const authorId of reviewers) {
            const rating = weightedRating();
            usedAuthors.add(String(authorId));
            intents.push({
                authorId,
                productId: product._id,
                rating,
                content: buildComment(rating, usedComments)
            });
        }

        reviewCountByProduct.set(String(product._id), reviewers.length);
    }

    if (intents.length === 0) {
        log("Reviews: no eligible reviewers — skipping.");
        return { comments: 0, reviews: 0 };
    }

    // 1) Insert comments. insertMany preserves input order, so index i of the
    //    result lines up with intents[i].
    const commentDocs = intents.map((i) => ({ authorId: i.authorId, content: i.content }));
    const insertedComments = await Comment.insertMany(commentDocs);

    // 2) Insert reviews, each linked to the comment created for it.
    const reviewDocs = intents.map((intent, i) => ({
        authorId: intent.authorId,
        productId: intent.productId,
        commentId: insertedComments[i]._id,
        rating: intent.rating
    }));
    const insertedReviews = await Review.insertMany(reviewDocs);

    // Keep each product's universal.reviewsCount in sync with reality (the live
    // app increments it on every created review), so seeded ratings look honest.
    await Product.bulkWrite(
        [...reviewCountByProduct].map(([id, count]) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { "universal.reviewsCount": count } }
            }
        }))
    );

    log(`Reviews: ${insertedComments.length} comments and ${insertedReviews.length} reviews created across ${reviewCountByProduct.size} products by ${usedAuthors.size} distinct authors.`);
    return { comments: insertedComments.length, reviews: insertedReviews.length, authors: usedAuthors.size };
};

// Deletes the reviews + comments this seeder owns (reviews on seed products and
// the comments they reference). Run BEFORE seed products are deleted on --reset.
const resetReviewData = async (sellerIds) => {
    const productIds = await Product.find({ "universal.sellerId": { $in: sellerIds } })
        .distinct("_id");

    const reviews = await Review.find({ productId: { $in: productIds } })
        .select("commentId")
        .lean();

    const commentIds = reviews.map((r) => r.commentId).filter(Boolean);

    const removedReviews = await Review.deleteMany({ productId: { $in: productIds } });
    const removedComments = await Comment.deleteMany({ _id: { $in: commentIds } });

    log(`Reset: removed ${removedReviews.deletedCount} reviews and ${removedComments.deletedCount} comments.`);
};

// Deletes ONLY data this seeder owns: products by the seed sellers and the
// 15 seed categories (matched by their unique names). Sellers are kept and reused.
const resetSeedData = async (sellerIds) => {
    const seedCategoryNames = categories.map((c) => c.name);

    const removedProducts = await Product.deleteMany({
        "universal.sellerId": { $in: sellerIds }
    });
    const removedCategories = await Category.deleteMany({
        name: { $in: seedCategoryNames }
    });

    log(`Reset: removed ${removedProducts.deletedCount} products and ${removedCategories.deletedCount} categories.`);
};

const run = async () => {
    log(`Connecting to MongoDB${RESET ? " (--reset mode)" : ""}...`);
    await mongoose.connect(MONGO_URI);
    log("Connected.");

    try {
        const sellerIds = await ensureSellers();

        if (RESET) {
            // Clean reviews/comments first — it needs the (still-existing) seed
            // product ids to know which review data to remove.
            await resetReviewData(sellerIds);
            await resetSeedData(sellerIds);
        }

        const categoriesByKey = await ensureCategories();
        await seedProducts(categoriesByKey, sellerIds);

        // Reviews depend on products existing; reviewers are the authors.
        const { ids: reviewerIds } = await ensureReviewers();
        await seedReviews(sellerIds, reviewerIds);

        log("Done.");
    } finally {
        await mongoose.disconnect();
        log("Disconnected.");
    }
};

run().catch((err) => {
    console.error("[seed] Failed:", err);
    process.exitCode = 1;
    mongoose.disconnect().catch(() => {});
});
