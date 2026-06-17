# DevMarket API — QA Documentation

## Overview

This directory contains complete QA test cases for the DevMarket REST API, as well as an OpenAPI 3.0 collection for import into API Dog / Postman.

---

## Directory Structure

```
test-cases/
├── README.md          — this file
├── auth.md            — Authentication endpoints (7 test groups)
├── users.md           — User management endpoints (4 test groups)
├── products.md        — Product CRUD endpoints (4 test groups)
├── categories.md      — Category CRUD endpoints (4 test groups)
├── chat.md            — Chat management endpoints (3 test groups)
├── messages.md        — Message CRUD endpoints (4 test groups)
├── payments.md        — Payment / Stripe endpoints (checkout + webhook)
├── reviews.md         — Review CRUD endpoints (get / create / edit / delete)
├── orders.md          — Order endpoints (list / status / delete + webhook-created)
├── search.md          — Search endpoints (3 test groups)
└── apidog/
    └── openapi.json   — OpenAPI 3.0 spec (import into API Dog or Postman)
```

---

## API Base URL

```
http://localhost:5000/api/v1
```

---

## Known Bugs Found During Analysis

The following bugs were discovered during code review and should be included in regression testing:

| # | Location | Bug |
|---|----------|-----|
| 1 | `chat.controller.js:getChats` | Route `GET /api/v1/chat` is **not protected** by `protect` middleware, but the controller accesses `req.user._id` → will throw `Cannot read properties of undefined` for unauthenticated requests |
| 2 | `message.controller.js:getMessages` | Reads `chatId` from `req.params` but the route is `GET /` (no URL param) — should be `req.query.chatId` |
| 3 | `message.controller.js:sendMessage` | Reads `chatId` from `req.params` but the route is `POST /` (no URL param) — likely should come from `req.body` |
| 4 | `user.controller.js:changeRole` | Logic bug: `if (role !== "user" \|\| role !== "seller" \|\| role !== "admin")` is always `true`. Should use `&&` |
| 5 | `user.controller.js:deleteUser` | Logic bug: `if (user._id !== req.user._id \|\| req.user.role !== "admin")` blocks admins from deleting other users. Should use `&&` |
| 6 | `payment.controller.js:stripeWebhook` | No idempotency guard — a retried `checkout.session.completed` event creates a **duplicate order** and decrements stock again (does not check `payment.webhookProcessed`). See PAY-014 / ORD-011 |
| 7 | `review.controller.js:getProductReviews` | `reviewsCount` = `Review.countDocuments()` with **no `{ productId }` filter** — returns total DB review count, not per-product. Sort key is also misspelled `creadetAt`. See REV-001 |
| 8 | `review.controller.js:createReview` | **No "one user — one review per product"** constraint — a user can post unlimited reviews on one product. See REV-006 |
| 9 | `order.controller.js:getUserOrders` | `orderCount` = `Order.countDocuments()` with **no `{ userId }` filter** — returns total DB order count, not the caller's. See ORD-001 |
| 10 | `payment.controller.js:createCheckoutSession` | Quantity validation `return next(...)` runs inside a `.reduce()` callback — does not early-return; handler keeps executing after the error. See PAY-003 |

> **Resolved:** The previous `stripeAccountId` checkout-blocking issue no longer applies — the seller Stripe Connect gate and transfers are commented out in `payment.controller.js`, so checkout succeeds without connected accounts.

---

## How to Import the Collection into API Dog

1. Open **API Dog** → click **Import**
2. Select **OpenAPI / Swagger**
3. Upload `test-cases/apidog/openapi.json`
4. Click **Import** and choose your target project

### Postman

1. Open **Postman** → click **Import**
2. Drag and drop `test-cases/apidog/openapi.json`
3. Select **OpenAPI 3.0** format

---

## Environment Variables

Set these in your API Dog / Postman environment before running requests:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `BASE_URL` | Server base URL | `http://localhost:5000/api/v1` |
| `JWT_TOKEN` | Valid user auth cookie value | `eyJhbGciOiJIUzI1...` |
| `ADMIN_TOKEN` | Valid admin auth cookie value | `eyJhbGciOiJIUzI1...` |
| `USER_TOKEN` | Valid regular user auth cookie value | `eyJhbGciOiJIUzI1...` |
| `SELLER_TOKEN` | Valid seller auth cookie value | `eyJhbGciOiJIUzI1...` |

> **Note:** Authentication uses **HttpOnly cookies** (`authToken`). For API Dog/Postman testing, you need to capture the cookie from a successful login response and include it as a Cookie header: `Cookie: authToken=<value>`

---

## Test Accounts Required

| Role | Purpose |
|------|---------|
| `user` (regular) | Testing access-denied scenarios for seller/admin routes |
| `seller` | Testing product creation/edit/delete |
| `admin` | Testing category management, role changes |
| Unregistered email | Testing registration flows |
| Unverified account | Testing login block for unverified users |

---

## How to Run Tests

### Manual (API Dog / Postman)
1. Import `apidog/openapi.json`
2. Set environment variables (see above)
3. Login via `POST /auth/login` → copy the `authToken` cookie value → set as env var
4. Run test cases in order within each group (some depend on created resources)

### Rate Limits to be Aware Of

| Endpoint | Limit |
|----------|-------|
| Global (all routes) | 200 req / 15 min |
| `POST /auth/register` | 5 req / 60 min |
| `POST /auth/login` | 5 req / 15 min |
| `GET /auth/verification` | 3 req / 10 min |
| `POST /payment/checkout` | `paymentLimiter` window |
| `POST /review/:productId` (create) | 5 req / 10 min |
| `PATCH /review/:reviewId` (edit) | 10 req / 10 min |
| `DELETE /review/:reviewId` | 10 req / 10 min |
| `PATCH /order/:orderId` (status) | 15 req / 10 min |
| `DELETE /order/:orderId` | 10 req / 10 min |

---

## Test Case ID Convention

```
AUTH-001   — Auth module, test #1
USER-001   — Users module, test #1
PROD-001   — Products module, test #1
CAT-001    — Categories module, test #1
CHAT-001   — Chats module, test #1
MSG-001    — Messages module, test #1
PAY-001    — Payments module, test #1
REV-001    — Reviews module, test #1
ORD-001    — Orders module, test #1
SRCH-001   — Search module, test #1
```

---

## API Dog Variables

The `reviews.md`, `orders.md` and `payments.md` cases use API Dog / Postman environment variables so requests are copy-paste runnable:

| Variable | Description |
|----------|-------------|
| `{{baseUrl}}` | `http://localhost:5000/api/v1` |
| `{{accessToken}}` | Regular user `authToken` cookie value |
| `{{adminToken}}` | Admin `authToken` cookie value |
| `{{userId}}` | Existing user id |
| `{{productId}}` | Existing product id |
| `{{reviewId}}` | Existing review id |
| `{{orderId}}` | Existing order id |
| `{{paymentId}}` | Existing payment id |

> Authentication is via the **HttpOnly `authToken` cookie**. In API Dog/Postman, capture it from a `POST /auth/login` response and send it as `Cookie: authToken={{accessToken}}`.
