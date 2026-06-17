# Reviews Test Cases

Base path: `/api/v1/review`

| API Dog variable | Meaning |
|------------------|---------|
| `{{baseUrl}}` | `http://localhost:5000/api/v1` |
| `{{accessToken}}` | Regular user `authToken` cookie value |
| `{{adminToken}}` | Admin `authToken` cookie value |
| `{{productId}}` | Existing product id |
| `{{reviewId}}` | Existing review id |

### Endpoints

| Method | URL | Auth | Rate limit | Validation |
|--------|-----|------|-----------|------------|
| `GET` | `/review/:productId` | Public | global (200/15m) | — |
| `POST` | `/review/:productId` | User (JWT) | 5 / 10 min | `createReviewSchema` |
| `DELETE` | `/review/:reviewId` | User (JWT) / owner or admin | 10 / 10 min | — |
| `PATCH` | `/review/:reviewId` | User (JWT) / owner only | 10 / 10 min | `editReviewSchema` |

> **Validation rules (`createReviewSchema` / `editReviewSchema`):**
> - `content`: string, trimmed, **min 5 / max 100** chars (optional on edit)
> - `rating`: **number** 1–5 (optional on edit)
> - `.strict()` — unknown fields are rejected with `"Unknown fields are not allowed!"`

> **Bug notes (REVIEW):**
> 1. `getProductReviews` returns `reviewsCount: Review.countDocuments()` **without** a `{ productId }` filter, so the count is the total number of reviews in the DB, not for this product.
> 2. The sort key is misspelled `creadetAt` (should be `createdAt`), so results are effectively unsorted.
> 3. There is **no "one user — one review per product"** constraint, neither in the schema nor the controller, so a user can post unlimited reviews on the same product (see REV-006).

---

## REV-001 — Get product reviews: success (public)

**Priority:** Critical

**Preconditions:** Product `{{productId}}` exists and has at least one review.

**Request:**
```
GET {{baseUrl}}/review/{{productId}}?page=1&limit=12
```

- **Path Params:** `productId` — product id
- **Query Params:** `page` (default `1`), `limit` (default `12`)
- **Headers:** none required (public route — defined before `protect`)

**Success Response:**
- Status: `200`
```json
{
  "status": "success",
  "message": "Product reviews returned successfully!",
  "reviewsCount": 5,
  "data": {
    "reviews": [
      {
        "_id": "...",
        "authorId": { "_id": "...", "fullname": "...", "email": "..." },
        "productId": "...",
        "commentId": { "_id": "...", "content": "Great product", "authorId": "..." },
        "rating": 5,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```
- `authorId` and `commentId` are populated.

**Description:** Returns paginated reviews for a product. No authentication required.

---

## REV-002 — Get product reviews: no reviews / non-existent product

**Priority:** Medium

**Preconditions:** `{{productId}}` has no reviews, or a syntactically valid ObjectId that does not exist.

**Request:**
```
GET {{baseUrl}}/review/000000000000000000000000
```

**Success Response:**
- Status: `200`
- Body: `{ "status": "success", "message": "Product reviews returned successfully!", "reviewsCount": <total>, "data": { "reviews": [] } }`

**Description:** The controller does not check product existence on GET, so an empty array is returned. (Note: `reviewsCount` reflects total DB reviews, not this product — REVIEW bug #1.)

---

## REV-003 — Get product reviews: invalid ObjectId

**Priority:** Medium

**Request:**
```
GET {{baseUrl}}/review/not-a-valid-id
```

**Error Response:**
- Status: `500` — Mongoose `CastError` (`Cast to ObjectId failed`); there is no id-format validation on this route.

**Description:** Boundary/negative — malformed path param.

---

## REV-004 — Get product reviews: pagination boundaries

**Priority:** Low

**Request:**
```
GET {{baseUrl}}/review/{{productId}}?page=2&limit=1
GET {{baseUrl}}/review/{{productId}}?page=-5&limit=0
GET {{baseUrl}}/review/{{productId}}?page=abc&limit=abc
```

**Expected Result:**
- Valid values paginate normally (`skip = (page-1)*limit`).
- Non-numeric `page`/`limit` fall back to defaults (`page=1`, `limit=12`) via `Number(...) || default`.
- `page=-5` produces a negative `skip` → Mongoose throws / returns no docs.

**Description:** Boundary values for query params.

---

## REV-005 — Create review: success

**Priority:** Critical

**Preconditions:** Logged-in user; product `{{productId}}` exists.

**Request:**
```
POST {{baseUrl}}/review/{{productId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{
  "content": "Really solid product, would recommend.",
  "rating": 5
}
```

**Success Response:**
- Status: `201`
```json
{
  "status": "success",
  "message": "Review created successfully!",
  "data": {
    "review": {
      "_id": "...",
      "authorId": { "_id": "...", "fullname": "...", "email": "..." },
      "productId": "...",
      "commentId": { "_id": "...", "content": "Really solid product, would recommend." },
      "rating": 5
    }
  }
}
```
- A `Comment` document is created with `authorId` + `content`.
- `product.universal.reviewsCount` is incremented by 1.

**Description:** Creates a comment + review pair and links them.

---

## REV-006 — Create review: same user reviews same product twice (no uniqueness)

**Priority:** High

**Preconditions:** User already has a review on `{{productId}}`.

**Request:**
```
POST {{baseUrl}}/review/{{productId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Second review by same user", "rating": 3 }
```

**Expected Result:**
- Status: `201` — a **second** review is created.

**Description:** Documents the **missing** "one user — one review" restriction (REVIEW bug #3). If a uniqueness rule is added later, the expected result becomes `409 Conflict`.

---

## REV-007 — Create review: product not found

**Priority:** High

**Request:**
```
POST {{baseUrl}}/review/000000000000000000000000
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Review for missing product", "rating": 4 }
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Product not found!" }`

---

## REV-008 — Create review: validation errors

**Priority:** High

**Preconditions:** Logged-in user.

**Cases:**

| # | Body | Expected |
|---|------|----------|
| a | `{ "rating": 5 }` (missing `content`) | `400` `"Validation failed!"`, fieldErrors.content |
| b | `{ "content": "Nice" }` (missing `rating`) | `400` fieldErrors.rating |
| c | `{ "content": "Hi", "rating": 5 }` (content < 5 chars) | `400` `"Review content must contain at least 5 characters!"` |
| d | `{ "content": "<101 chars>", "rating": 5 }` | `400` `"Review content is too long!"` |
| e | `{ "content": "Valid text", "rating": 0 }` | `400` `"Rating must be at least 1"` |
| f | `{ "content": "Valid text", "rating": 6 }` | `400` `"Rating is too long!"` |
| g | `{ "content": "Valid text", "rating": "5" }` (string, not number) | `400` — `rating` must be a number |
| h | `{ "content": "Valid text", "rating": 5, "isAdmin": true }` | `400` `"Unknown fields are not allowed!"` (strict schema) |
| i | `{}` (empty body) | `400` — validation errors for `content` + `rating` |

**Request example (case c):**
```
POST {{baseUrl}}/review/{{productId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Hi", "rating": 5 }
```

**Description:** Covers missing fields, wrong types, boundary values and strict-mode rejection.

---

## REV-009 — Create review: special characters & large content boundary

**Priority:** Low

**Request:**
```
POST {{baseUrl}}/review/{{productId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Émojis 🚀 <script>alert(1)</script> & symbols ©®", "rating": 4 }
```

**Expected Result:**
- Status: `201` if length 5–100 after trim; stored as a plain string (no HTML execution in a JSON API).
- Exactly 100 chars → `201`; 101 chars → `400` `"Review content is too long!"`.

**Description:** Special characters and the upper length boundary.

---

## REV-010 — Create review: unauthorized (no cookie)

**Priority:** Critical

**Request:**
```
POST {{baseUrl}}/review/{{productId}}
Content-Type: application/json

{ "content": "No auth review", "rating": 5 }
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

**Description:** `protect` runs before create. Note the limiter is applied before `validate`, but `protect` (router-level) runs first.

---

## REV-011 — Create review: rate limit exceeded (> 5 in 10 min)

**Priority:** High

**Preconditions:** 5 successful/attempted creates from same IP within 10 minutes.

**Request:** Repeat `POST {{baseUrl}}/review/{{productId}}` a 6th time.

**Error Response:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many create requests. Please try again later." }`

---

## REV-012 — Edit review: success (owner)

**Priority:** Critical

**Preconditions:** `{{reviewId}}` belongs to the logged-in user.

**Request:**
```
PATCH {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Updated review text", "rating": 4 }
```

**Success Response:**
- Status: `200`
```json
{
  "status": "success",
  "message": "Information edited successfully!",
  "data": { "review": { "_id": "...", "rating": 4, "commentId": { "content": "Updated review text" }, ... } }
}
```
- `rating` updated on the review; `content` updated on the linked `Comment`.

**Description:** Partial update — either/both `content` and `rating` may be provided.

---

## REV-013 — Edit review: only one field / empty body

**Priority:** Medium

**Request (only rating):**
```
PATCH {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "rating": 2 }
```

**Expected Result:**
- Status: `200` — only `rating` changes; comment untouched.
- Empty body `{}` → `200` (both fields optional; nothing changes, `review.save()` still runs).

**Description:** Both schema fields are optional on edit.

---

## REV-014 — Edit review: not the owner (forbidden)

**Priority:** Critical

**Preconditions:** `{{reviewId}}` belongs to a **different** user.

**Request:**
```
PATCH {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "content": "Trying to edit someone else's review", "rating": 1 }
```

**Error Response:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You cant edit this review!" }`

**Description:** Edit is restricted to the author — **admins cannot edit** other users' reviews (unlike delete).

---

## REV-015 — Edit review: not found

**Priority:** High

**Request:**
```
PATCH {{baseUrl}}/review/000000000000000000000000
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "rating": 3 }
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Review not found!" }`

---

## REV-016 — Edit review: validation errors

**Priority:** Medium

**Cases:** Same constraints as create but all optional. Examples:

| Body | Expected |
|------|----------|
| `{ "rating": 9 }` | `400` `"Rating is too long!"` |
| `{ "content": "no" }` | `400` `"Review content must contain at least 5 characters!"` |
| `{ "rating": "4" }` | `400` — rating must be a number |
| `{ "foo": "bar" }` | `400` `"Unknown fields are not allowed!"` |

---

## REV-017 — Edit review: rate limit exceeded (> 10 in 10 min)

**Priority:** Medium

**Request:** Repeat `PATCH {{baseUrl}}/review/{{reviewId}}` an 11th time within 10 minutes.

**Error Response:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many edit requests. Please try again later." }`

---

## REV-018 — Delete review: success (owner)

**Priority:** Critical

**Preconditions:** `{{reviewId}}` belongs to the logged-in user; its product still exists.

**Request:**
```
DELETE {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
```

**Success Response:**
- Status: `200`
- Body: `{ "status": "success", "message": "Review deleted successfully!" }`
- `product.universal.reviewsCount` decremented by 1.

---

## REV-019 — Delete review: success (admin deleting another user's review)

**Priority:** High

**Preconditions:** `{{reviewId}}` belongs to a regular user; admin is logged in.

**Request:**
```
DELETE {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{adminToken}}
```

**Success Response:**
- Status: `200`
- Body: `{ "status": "success", "message": "Review deleted successfully!" }`

**Description:** Delete allows author **or** `role === "admin"`.

---

## REV-020 — Delete review: not owner and not admin (forbidden)

**Priority:** Critical

**Preconditions:** `{{reviewId}}` belongs to another user; requester is a non-admin user.

**Request:**
```
DELETE {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You cant delete this review!" }`

---

## REV-021 — Delete review: not found

**Priority:** High

**Request:**
```
DELETE {{baseUrl}}/review/000000000000000000000000
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Review not found!" }`

---

## REV-022 — Delete review: linked product missing

**Priority:** Low

**Preconditions:** Review exists but its `productId` no longer exists (e.g. product was sold out and auto-deleted).

**Request:**
```
DELETE {{baseUrl}}/review/{{reviewId}}
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Product not found!" }`

**Description:** The controller loads the review's product before the ownership check; a dangling review cannot be deleted through this route.

---

## REV-023 — Delete review: unauthorized (no cookie)

**Priority:** Critical

**Request:**
```
DELETE {{baseUrl}}/review/{{reviewId}}
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## REV-024 — Reviews: JWT tampered / expired

**Priority:** High

**Request:**
```
POST {{baseUrl}}/review/{{productId}}
Cookie: authToken=eyJhbGciOiJIUzI1NiJ9.TAMPERED.SIG
Content-Type: application/json

{ "content": "Valid content", "rating": 5 }
```

**Expected Result:**
- Status: `4xx`/`5xx` — `jwt.verify` throws in `protect`; request rejected before reaching the controller.

**Description:** JWT signature/expiry verification on all mutating review routes.
