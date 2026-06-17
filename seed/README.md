# DevMarket — Database Seeder

Generates realistic test data for the DevMarket marketplace: **15 categories**,
**4 seller users**, **~200 products**, a pool of **buyer users** and **3–10
reviews per product** (each with its own comment).

All documents are built strictly against the existing Mongoose models in
`server/models` — no schema, route, controller or client code is modified.

## How it maps to the models

| Model | Notes |
|-------|-------|
| `Category` | `name` (unique, 5–50), `description` (10–500), `allowedAttributes` (≥1), `image { url, public_id }`. `isActive`/`parentCategory` use schema defaults. |
| `User` (seller) | Products require `universal.sellerId`, so the seeder ensures seller users exist. Created via `.save()` so the password-hashing pre-save hook runs. Default password: `SeedPass123!`. |
| `Product` | `universal.{title, description, price, stock, category, sellerId, images[]}` + `attributes` (Mixed). Attribute **keys are always a subset of the category's `allowedAttributes`** and **values are always strings**, matching the app's `attributes` validation (`z.record(z.string())`). Brand, rating, reviews count, discount, warranty, etc. live inside `attributes` because the schema has no dedicated top-level fields for them. `universal.reviewsCount` is set to the real number of seeded reviews. |
| `User` (buyer) | Review authors. The base seed only has sellers, so a pool of regular `role: "user"` buyers is created **only when existing users are too few** (`< 15`). Default password: `SeedPass123!`. |
| `Comment` | `authorId` (ref `User`), `content`. One comment is created per review. Content is composed from sentiment-matched fragments so no two seeded comments are identical. |
| `Review` | `authorId` (ref `User`), `productId` (ref `Product`), `commentId` (ref `Comment`), `rating` (1–5). 3–10 per product, each from a **different** user (never the product's own seller, never the same user twice on one product). Ratings follow a natural distribution (mostly 4–5, some 3, few 1–2). |

Images use stable public placeholders from `picsum.photos`; `public_id` values are
namespaced (`seed/...`) so seed data is easy to recognize.

## Usage

The connection string is read from `server/.env` (`MONGO_URI`).

```bash
# From the project root:
node seed/index.js          # seed without touching existing data
node seed/index.js --reset  # delete ONLY seed-created data, then re-seed
```

### Behaviour

- **Idempotent by default.** Categories, sellers and buyers are found-or-created by
  their unique fields. If seed products already exist, product creation is skipped;
  likewise, if reviews already exist for seed products, review creation is skipped
  (the script tells you to use `--reset` to regenerate).
- **Safe.** Without `--reset` the seeder never deletes anything. `--reset` removes
  **only** data this seeder owns: reviews on seed products and their comments,
  products belonging to the seed sellers, and the 15 categories matched by name.
  Seller and buyer users are kept and reused.

## Files

- `index.js` — runner: connects, ensures sellers + categories, creates products, ensures reviewers, creates comments + reviews, prints counts, disconnects.
- `data/categories.js` — the 15 category definitions + shared attribute list.
- `data/products.js` — ~200 product entries grouped by category.
- `data/sellers.js` — seed seller users.
- `data/buyers.js` — pool of buyer (review-author) users.
- `data/comments.js` — sentiment-grouped comment fragments (positive / neutral / negative).
- `helpers.js` — generators for descriptions, images, attributes, product documents, ratings and comments.
