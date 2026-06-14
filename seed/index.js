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
const mongoose = Product.base;

const { categories } = require("./data/categories");
const { productPools } = require("./data/products");
const { sellers } = require("./data/sellers");
const { buildProductDocs } = require("./helpers");

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
            await resetSeedData(sellerIds);
        }

        const categoriesByKey = await ensureCategories();
        await seedProducts(categoriesByKey, sellerIds);

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
