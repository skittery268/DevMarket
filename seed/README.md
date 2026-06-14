# DevMarket — Database Seeder

Generates realistic test data for the DevMarket marketplace: **15 categories**,
**4 seller users** and **~200 products**.

All documents are built strictly against the existing Mongoose models in
`server/models` — no schema, route, controller or client code is modified.

## How it maps to the models

| Model | Notes |
|-------|-------|
| `Category` | `name` (unique, 5–50), `description` (10–500), `allowedAttributes` (≥1), `image { url, public_id }`. `isActive`/`parentCategory` use schema defaults. |
| `User` (seller) | Products require `universal.sellerId`, so the seeder ensures seller users exist. Created via `.save()` so the password-hashing pre-save hook runs. Default password: `SeedPass123!`. |
| `Product` | `universal.{title, description, price, stock, category, sellerId, images[]}` + `attributes` (Mixed). Attribute **keys are always a subset of the category's `allowedAttributes`** and **values are always strings**, matching the app's `attributes` validation (`z.record(z.string())`). Brand, rating, reviews count, discount, warranty, etc. live inside `attributes` because the schema has no dedicated top-level fields for them. |

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

- **Idempotent by default.** Categories and sellers are found-or-created by their
  unique fields. If seed products already exist, product creation is skipped (the
  script tells you to use `--reset` to regenerate).
- **Safe.** Without `--reset` the seeder never deletes anything. `--reset` removes
  **only** data this seeder owns: products belonging to the seed sellers and the
  15 categories matched by name. Seller users are kept and reused.

## Files

- `index.js` — runner: connects, ensures sellers + categories, creates products, prints counts, disconnects.
- `data/categories.js` — the 15 category definitions + shared attribute list.
- `data/products.js` — ~200 product entries grouped by category.
- `data/sellers.js` — seed seller users.
- `helpers.js` — generators for descriptions, images, attributes and final product documents.
