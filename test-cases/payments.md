# Payments Test Cases

Base path: `/api/v1/payment`

| API Dog variable | Meaning |
|------------------|---------|
| `{{baseUrl}}` | `http://localhost:5000/api/v1` |
| `{{accessToken}}` | Buyer `authToken` cookie value |
| `{{productId}}` | Existing product id |
| `{{paymentId}}` | Existing payment id |

### Endpoints

| Method | URL | Auth | Rate limit | Notes |
|--------|-----|------|-----------|-------|
| `POST` | `/payment/checkout` | User (JWT) | `paymentLimiter` + global | Creates a Stripe Checkout session + `pending` Payment |
| `POST` | `/payment/webhook` | Stripe signature (no JWT) | — | Stripe → server; uses `express.raw` |

> **Status update (was a known bug):** The seller `stripeAccountId` gate and Stripe Connect transfers are currently **commented out** in `payment.controller.js`. Checkout therefore **no longer fails** when sellers have no connected account, and no `stripe.transfers.create` calls are made. The earlier "All sellers must have a Stripe account connected" failure path is **no longer reachable**.

> **Request body — `POST /payment/checkout`:**
> ```json
> {
>   "userOrder": [ { "id": "<productId>", "quantity": 2 } ],
>   "userInfo": {
>     "fullname": "John Doe",
>     "email": "john@example.com",
>     "city": "Tbilisi",
>     "country": "Georgia",
>     "address": "Rustaveli ave 1",
>     "phone": "+995555123456",
>     "zipcode": "0100"
>   }
> }
> ```
> `userInfo` is persisted on the `Payment` and copied onto the `Order` created by the webhook.

---

## PAY-001 — Create Checkout Session: successful order

**Priority:** Critical

**Preconditions:**
- Buyer logged in
- All products in `userOrder` exist in DB
- Stripe configured with valid API keys and `success_url` / `cancel_url`

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{
  "userOrder": [
    { "id": "{{productId}}", "quantity": 2 },
    { "id": "64f1b2c3d4e5f6a7b8c9d0e2", "quantity": 1 }
  ],
  "userInfo": {
    "fullname": "John Doe",
    "email": "john@example.com",
    "city": "Tbilisi",
    "country": "Georgia",
    "address": "Rustaveli ave 1",
    "phone": "+995555123456",
    "zipcode": "0100"
  }
}
```

**Success Response:**
- Status: `201`
```json
{
  "status": "success",
  "message": "Session created!",
  "data": {
    "payment": {
      "_id": "...",
      "userId": "...",
      "stripeSessionId": "cs_test_...",
      "totalAmount": 229.97,
      "platformCommission": 11.5,
      "sellerNetAmount": 218.47,
      "status": "pending",
      "sellerDistributions": [ { "productId": "...", "sellerId": "...", "quantity": 2, "itemTotal": ..., "commission": ..., "sellerAmount": ... } ],
      "webhookProcessed": false,
      "userInfo": { "fullname": "John Doe", "...": "..." }
    },
    "sessionUrl": "https://checkout.stripe.com/c/pay/...",
    "sessionId": "cs_test_..."
  }
}
```
- Platform commission = 5% of total; `sellerAmount = itemTotal - commission` per product.
- `transferGroup` generated as `order_<timestamp>_<random>`.
- **No Order is created yet** — only a `pending` Payment (the Order is created by the webhook).

**Description:** Happy path — creates a Stripe session and a pending payment record.

---

## PAY-002 — Create Checkout Session: product not found

**Priority:** High

**Preconditions:** Buyer logged in.

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{
  "userOrder": [ { "id": "000000000000000000000000", "quantity": 1 } ],
  "userInfo": { "fullname": "John Doe", "email": "john@example.com", "city": "Tbilisi", "country": "Georgia", "address": "X", "phone": "+9955551", "zipcode": "0100" }
}
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Products cant be found" }`

**Description:** When none of the requested ids resolve, `products.length == 0`.

---

## PAY-003 — Create Checkout Session: quantity is not a positive integer

**Priority:** High

**Preconditions:** Buyer logged in. Product exists.

**Cases:**

| `quantity` | Expected |
|------------|----------|
| `-1` | `400` `"Incorrect quantity!"` |
| `0` | `400` `"Incorrect quantity!"` (`<= 0`) |
| `1.5` | `400` `"Incorrect quantity!"` (`Number.isInteger` false) |
| `"2"` (string) | `400` `"Incorrect quantity!"` (not an integer) |

**Request example:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{
  "userOrder": [ { "id": "{{productId}}", "quantity": -1 } ],
  "userInfo": { "fullname": "John Doe", "email": "john@example.com", "city": "Tbilisi", "country": "Georgia", "address": "X", "phone": "+9955551", "zipcode": "0100" }
}
```

> Note: the quantity check `return next(...)` runs **inside a `.reduce()` callback**, so `createCheckoutSession` keeps executing after calling `next`. Expect the error response, but be aware the handler does not early-return cleanly.

---

## PAY-004 — Create Checkout Session: empty userOrder array

**Priority:** High

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "userOrder": [], "userInfo": { "fullname": "J", "email": "j@e.com", "city": "T", "country": "G", "address": "X", "phone": "+1", "zipcode": "1" } }
```

**Error Response:**
- Status: `404` — empty ids → `Product.find({ _id: { $in: [] } })` returns `[]` → `"Products cant be found"`.

---

## PAY-005 — Create Checkout Session: missing userOrder field

**Priority:** High

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "userInfo": { "fullname": "J", "email": "j@e.com", "city": "T", "country": "G", "address": "X", "phone": "+1", "zipcode": "1" } }
```

**Error Response:**
- Status: `5xx` — `userOrder.map(...)` throws `TypeError: Cannot read properties of undefined`. There is **no request-body validation** on this route.

**Description:** Negative — missing required top-level field.

---

## PAY-006 — Create Checkout Session: missing / partial userInfo

**Priority:** Medium

**Preconditions:** Buyer logged in. Product exists.

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "userOrder": [ { "id": "{{productId}}", "quantity": 1 } ] }
```

**Expected Result:**
- The Stripe session is created first; then `Payment.create({ ..., userInfo: undefined })` runs.
- Because `userInfo.*` fields are `required` in the Payment schema, creation fails with a Mongoose `ValidationError` → `4xx`/`5xx` — **after** a Stripe session was already created (orphan session).

**Description:** Documents that `userInfo` is validated only at the DB layer, not before the Stripe call.

---

## PAY-007 — Create Checkout Session: unauthorized (no cookie)

**Priority:** Critical

**Request:**
```
POST {{baseUrl}}/payment/checkout
Content-Type: application/json

{ "userOrder": [ { "id": "{{productId}}", "quantity": 1 } ], "userInfo": { "fullname": "J", "email": "j@e.com", "city": "T", "country": "G", "address": "X", "phone": "+1", "zipcode": "1" } }
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## PAY-008 — Create Checkout Session: rate limit exceeded

**Priority:** High

**Preconditions:** Multiple checkout requests from same IP within the `paymentLimiter` window.

**Request:** Repeat `POST {{baseUrl}}/payment/checkout` rapidly.

**Error Response:**
- Status: `429` — `paymentLimiter` (or global limiter) message.

**Description:** Protects against carding / Stripe quota abuse.

---

## PAY-009 — Create Checkout Session: NoSQL injection in product id

**Priority:** Critical

**Request:**
```
POST {{baseUrl}}/payment/checkout
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "userOrder": [ { "id": { "$gt": "" }, "quantity": 1 } ], "userInfo": { "fullname": "J", "email": "j@e.com", "city": "T", "country": "G", "address": "X", "phone": "+1", "zipcode": "1" } }
```

**Expected Result:**
- `express-mongo-sanitize` rewrites `$gt` → `_gt`; `Product.find` matches nothing → `404` `"Products cant be found"`.

---

## PAY-010 — Create Checkout Session: commission calculation correctness

**Priority:** High

**Preconditions:** Product price = $100; quantity = 2 (total = $200).

**Expected Result:**
- `itemTotal` = 200
- `commission` = 10.00 (5%)
- `sellerAmount` = 190.00
- `totalAmount` = 200, `platformCommission` = 10.00, `sellerNetAmount` = 190.00

**Description:** Verifies money math and rounding (`toFixed(2)`).

---

## PAY-011 — Stripe Webhook: checkout.session.completed (paid) → creates order

**Priority:** Critical

**Preconditions:** Valid `STRIPE_WEBHOOK_SECRET`; a `pending` Payment exists with the event's `session.id`.

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json
stripe-signature: <valid_stripe_signature>

<raw checkout.session.completed event body, payment_status = "paid">
```

**Success Response:**
- Status: `200`, Body: `{ "received": true }`
- **An `Order` is created** from `payment.sellerDistributions` (userId, userInfo, products, totalAmount, paymentId, default `status: "confirmed"`).
- Each product's `universal.stock` is decremented by its quantity; if stock `<= 0` the product is **deleted**.
- `Payment.status` → `"succeeded"`, `Payment.webhookProcessed` → `true`, `stripePaymentIntentId` set.
- (Stripe Connect `sellerTransfers` are currently **commented out** — none are created.)

**Description:** Core fulfillment path — the only place orders are created.

---

## PAY-012 — Stripe Webhook: session completed but not paid

**Priority:** High

**Preconditions:** Event `checkout.session.completed` with `payment_status !== "paid"`.

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json
stripe-signature: <valid_signature>

<event with payment_status = "unpaid">
```

**Expected Result:**
- Status: `200`, Body: `{ "received": true }`
- **No order created**, payment left as-is (early return on unpaid).

---

## PAY-013 — Stripe Webhook: payment record not found for session

**Priority:** Medium

**Preconditions:** Valid signature; no `Payment` matches `session.id`.

**Expected Result:**
- Status: `200`, Body: `{ "received": true }` — graceful no-op (no order, no error).

---

## PAY-014 — Stripe Webhook: duplicate / retried event (idempotency)

**Priority:** Critical

**Preconditions:** A Payment already processed (`webhookProcessed: true`, `status: "succeeded"`).

**Request:** Re-deliver the same `checkout.session.completed` event (same `session.id`).

**Current behavior:**
- The webhook does **not** check `webhookProcessed` before creating the order → it **creates a duplicate Order** and decrements stock again.

**Expected (desired):** Short-circuit on already-processed payments and return `{ "received": true }` without side effects.

**Description:** Regression test for the missing idempotency guard (see ORD-011).

---

## PAY-015 — Stripe Webhook: invalid signature

**Priority:** Critical

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json
stripe-signature: invalid_signature

{}
```

**Error Response:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Webhook error: No signatures found matching the expected signature for payload..." }`

---

## PAY-016 — Stripe Webhook: missing stripe-signature header

**Priority:** High

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json

{ "type": "checkout.session.completed" }
```

**Error Response:**
- Status: `400` — `stripe.webhooks.constructEvent` throws without a signature header.

---

## PAY-017 — Stripe Webhook: payment_intent.payment_failed

**Priority:** High

**Preconditions:** Payment record exists; valid signature.

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json
stripe-signature: <valid_signature>

<raw payment_intent.payment_failed event body>
```

**Expected Result:**
- Status: `200`, Body: `{ "received": true }`
- `Payment.status` → `"failed"`, `webhookProcessed` → `true`.

> Note: the handler reads the session id from `paymentIntent.payment_details?.order_reference`, which is not a standard Stripe field — if absent, `Payment.findOne` returns `null` and the handler no-ops with `{ "received": true }`.

---

## PAY-018 — Stripe Webhook: raw body integrity

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
POST {{baseUrl}}/payment/webhook
Content-Type: application/json
stripe-signature: <valid_signature>

<raw bytes — NOT re-serialized JSON>
```

**Expected Result:**
- `/payment/webhook` is mounted with `express.raw({ type: "application/json" })` (in `app.js`, before `express.json()`), preserving the raw body so signature verification succeeds.

**Description:** Ensures the raw-body middleware ordering is intact.
