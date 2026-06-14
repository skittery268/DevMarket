# Payments Test Cases

Base path: `/api/v1/payment`

> **Bug note (PAYMENT):**
> The `User` model has no `stripeAccountId` field. The checkout controller queries `.select('stripeAccountId')` and then checks `if (!seller || !seller.stripeAccountId)`. Since the field never exists, ALL checkout attempts will fail with `"All sellers must have a Stripe account connected before checkout."` until `stripeAccountId` is added to the User model.

---

## PAY-001 — Create Checkout Session: successful order

**Priority:** Critical

**Preconditions:**
- Buyer logged in
- All products exist in DB
- All sellers have `stripeAccountId` set (requires bug fix)
- Stripe configured with valid API keys

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "64f1b2c3d4e5f6a7b8c9d0e1", "quantity": 2 },
    { "id": "64f1b2c3d4e5f6a7b8c9d0e2", "quantity": 1 }
  ]
}
```

**Expected Result:**
- Status: `201`
- Body:
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
      "sellerDistributions": [...],
      "webhookProcessed": false
    },
    "sessionUrl": "https://checkout.stripe.com/pay/...",
    "sessionId": "cs_test_..."
  }
}
```
- Platform commission = 5% of total
- `sellerAmount` = `itemTotal` - `commission` per product
- Transfer group generated: `order_<timestamp>_<random>`

---

## PAY-002 — Create Checkout Session: seller without stripeAccountId [BUG]

**Priority:** Critical

**Preconditions:** Buyer logged in. Seller has no `stripeAccountId` (User model missing field).

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "<productId>", "quantity": 1 }
  ]
}
```

**Expected Result (current buggy behavior):**
- Status: `400`
- Body: `{ "status": "fail", "message": "All sellers must have a Stripe account connected before checkout." }`

---

## PAY-003 — Create Checkout Session: product not found

**Priority:** High

**Preconditions:** Buyer logged in.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "000000000000000000000000", "quantity": 1 }
  ]
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Products cant be found" }`

---

## PAY-004 — Create Checkout Session: quantity is not a positive integer

**Priority:** High

**Preconditions:** Buyer logged in. Product exists.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "<productId>", "quantity": -1 }
  ]
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Incorrect quantity!" }`

---

## PAY-005 — Create Checkout Session: quantity = 0

**Priority:** High

**Preconditions:** Buyer logged in. Product exists.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "<productId>", "quantity": 0 }
  ]
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Incorrect quantity!" }` (`quantity > 0` check fails)

---

## PAY-006 — Create Checkout Session: quantity is a float

**Priority:** Medium

**Preconditions:** Buyer logged in. Product exists.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": "<productId>", "quantity": 1.5 }
  ]
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Incorrect quantity!" }` (`Number.isInteger(1.5)` is `false`)

---

## PAY-007 — Create Checkout Session: empty userOrder array

**Priority:** High

**Preconditions:** Buyer logged in.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": []
}
```

**Expected Result:**
- Status: `404`
- `productsIds` is empty → `Product.find({ _id: { $in: [] } })` returns empty array → `products.length == 0`
- Body: `{ "status": "fail", "message": "Products cant be found" }`

---

## PAY-008 — Create Checkout Session: missing userOrder field

**Priority:** High

**Preconditions:** Buyer logged in.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{}
```

**Expected Result:**
- Status: `5xx` — `userOrder.map(...)` throws `TypeError: Cannot read properties of undefined` (no null check)

---

## PAY-009 — Create Checkout Session: without auth cookie

**Priority:** Critical

**Request:**
```
POST /api/v1/payment/checkout
Content-Type: application/json

{
  "userOrder": [{ "id": "<productId>", "quantity": 1 }]
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## PAY-010 — Create Checkout Session: rate limit exceeded

**Priority:** High

**Preconditions:** Multiple checkout requests from same IP in short window.

**Request:**
```
(Repeat POST /api/v1/payment/checkout many times rapidly)
```

**Expected Result:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many requests. Please try again later." }` (global or payment limiter)

---

## PAY-011 — Create Checkout Session: NoSQL injection in product ID

**Priority:** Critical

**Preconditions:** Buyer logged in.

**Request:**
```
POST /api/v1/payment/checkout
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "userOrder": [
    { "id": { "$gt": "" }, "quantity": 1 }
  ]
}
```

**Expected Result:**
- Sanitizer replaces `$` with `_`; `Product.find({ _id: { $in: [{ "_gt": "" }] } })` returns no results
- Status: `404` — "Products cant be found"

---

## PAY-012 — Stripe Webhook: checkout.session.completed (payment succeeded)

**Priority:** Critical

**Preconditions:** Valid Stripe webhook secret configured; valid payment record exists with `stripeSessionId`.

**Request:**
```
POST /api/v1/payment/webhook
Content-Type: application/json
stripe-signature: <valid_stripe_signature>

<Stripe checkout.session.completed event body>
```

**Expected Result:**
- Status: `200`
- Body: `{ "received": true }`
- `Payment.status` updated to `"succeeded"`
- `Payment.webhookProcessed` set to `true`
- Stripe transfers created for each seller
- `sellerTransfers` array populated in payment document

---

## PAY-013 — Stripe Webhook: invalid signature

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
POST /api/v1/payment/webhook
Content-Type: application/json
stripe-signature: invalid_signature

{}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Webhook error: No signatures found matching the expected signature for payload..." }`

---

## PAY-014 — Stripe Webhook: missing stripe-signature header

**Priority:** High

**Request:**
```
POST /api/v1/payment/webhook
Content-Type: application/json

{ "type": "checkout.session.completed" }
```

**Expected Result:**
- Status: `400`
- `stripe.webhooks.constructEvent` throws without signature header

---

## PAY-015 — Stripe Webhook: payment_intent.payment_failed event

**Priority:** High

**Preconditions:** Payment record exists; valid Stripe signature.

**Request:**
```
POST /api/v1/payment/webhook
Content-Type: application/json
stripe-signature: <valid_signature>

<Stripe payment_intent.payment_failed event body>
```

**Expected Result:**
- Status: `200`
- Body: `{ "received": true }`
- `Payment.status` updated to `"failed"`

---

## PAY-016 — Stripe Webhook: raw body integrity (Content-Type must be application/json, raw body)

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
POST /api/v1/payment/webhook
Content-Type: application/json
stripe-signature: <valid_signature>

<raw binary body (not parsed by express.json())>
```

**Expected Result:**
- Route `/api/v1/payment/webhook` uses `express.raw({ type: "application/json" })` specifically to preserve raw body for Stripe signature verification
- Signature verification succeeds because body is not re-parsed

---

## PAY-017 — Create Checkout Session: commission calculation correctness

**Priority:** High

**Preconditions:** Product price = $100; quantity = 2 (total = $200).

**Expected Result:**
- `itemTotal` = 200
- `commission` = 10.00 (5%)
- `sellerAmount` = 190.00
- `totalAmount` = 200
- `platformCommission` = 10.00
- `sellerNetAmount` = 190.00
