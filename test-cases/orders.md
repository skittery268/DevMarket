# Orders Test Cases

Base path: `/api/v1/order`

| API Dog variable | Meaning |
|------------------|---------|
| `{{baseUrl}}` | `http://localhost:5000/api/v1` |
| `{{accessToken}}` | Regular user `authToken` cookie value |
| `{{adminToken}}` | Admin `authToken` cookie value |
| `{{orderId}}` | Existing order id |

### Endpoints

| Method | URL | Auth | Rate limit | Notes |
|--------|-----|------|-----------|-------|
| `GET` | `/order/` | User (JWT) | global (200/15m) | Returns the **caller's** orders |
| `DELETE` | `/order/:orderId` | User (JWT) / owner only | 10 / 10 min | Owner can delete own order |
| `PATCH` | `/order/:orderId` | **Admin only** | 15 / 10 min | Change `status` |

> **Important — there is no "create order" endpoint.**
> Orders are created **only** by the Stripe webhook (`POST /payment/webhook`) when it receives a
> `checkout.session.completed` event whose `payment_status === "paid"`. See `payments.md` (PAY-012).
> This is what guarantees "no order without a successful payment" (ORD-009 / ORD-010).

> **Order status enum:** `confirmed` (default), `processing`, `shipped`, `delivered`, `completed`, `canceled`, `refunded`, `partially_refunded`.

> **Bug notes (ORDER):**
> 1. `getUserOrders` returns `orderCount: Order.countDocuments()` **without** a `{ userId }` filter — the count is the total number of orders in the DB, not the caller's. The `orders` array, however, *is* correctly filtered by `userId`.
> 2. `PATCH /order/:orderId` has **no body validation** — an invalid `status` value is only caught by the Mongoose enum on `save()`.

---

## ORD-001 — Get my orders: success

**Priority:** Critical

**Preconditions:** Logged-in user with at least one order.

**Request:**
```
GET {{baseUrl}}/order/?page=1&limit=12
Cookie: authToken={{accessToken}}
```

- **Query Params:** `page` (default `1`), `limit` (default `12`)

**Success Response:**
- Status: `200`
```json
{
  "status": "success",
  "message": "Orders returned successfully!",
  "orderCount": 3,
  "data": {
    "orders": [
      {
        "_id": "...",
        "userId": "...",
        "userInfo": { "fullname": "...", "email": "...", "city": "...", "country": "...", "address": "...", "phone": "...", "zipcode": "..." },
        "products": [ { "productId": "...", "sellerId": "...", "quantity": 2, "itemTotal": 199.98 } ],
        "totalAmount": 199.98,
        "status": "confirmed",
        "paymentId": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```
- `orders` sorted by `createdAt` descending and filtered to `req.user._id`.

**Description:** Returns the authenticated user's own orders (paginated).

---

## ORD-002 — Get my orders: empty list

**Priority:** Medium

**Preconditions:** Logged-in user who has never ordered.

**Request:**
```
GET {{baseUrl}}/order/
Cookie: authToken={{accessToken}}
```

**Success Response:**
- Status: `200`
- Body: `{ "status": "success", "message": "Orders returned successfully!", "orderCount": <total DB>, "data": { "orders": [] } }`

**Description:** No orders for this user → empty array. (`orderCount` reflects total DB orders — ORDER bug #1.)

---

## ORD-003 — Get my orders: unauthorized (no cookie)

**Priority:** Critical

**Request:**
```
GET {{baseUrl}}/order/
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

**Description:** Whole router is guarded by `protect`.

---

## ORD-004 — Get my orders: pagination boundaries

**Priority:** Low

**Request:**
```
GET {{baseUrl}}/order/?page=2&limit=1
GET {{baseUrl}}/order/?page=abc&limit=xyz
GET {{baseUrl}}/order/?page=-1&limit=0
```

**Expected Result:**
- Non-numeric `page`/`limit` fall back to defaults (`1` / `12`).
- `page=-1` → negative `skip` → Mongoose error / no docs.

**Description:** Boundary values for query params.

---

## ORD-005 — Change order status: success (admin)

**Priority:** Critical

**Preconditions:** Admin logged in; `{{orderId}}` exists.

**Request:**
```
PATCH {{baseUrl}}/order/{{orderId}}
Cookie: authToken={{adminToken}}
Content-Type: application/json

{ "status": "shipped" }
```

**Success Response:**
- Status: `200`
```json
{
  "status": "success",
  "message": "Order status changed successfully!",
  "data": { "order": { "_id": "...", "status": "shipped", ... } }
}
```

**Description:** Admin transitions an order to a valid status.

---

## ORD-006 — Change order status: forbidden (regular user)

**Priority:** Critical

**Preconditions:** Regular (non-admin) user logged in.

**Request:**
```
PATCH {{baseUrl}}/order/{{orderId}}
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "status": "delivered" }
```

**Error Response:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

**Description:** `allowedTo("admin")` blocks non-admins.

---

## ORD-007 — Change order status: order not found

**Priority:** High

**Request:**
```
PATCH {{baseUrl}}/order/000000000000000000000000
Cookie: authToken={{adminToken}}
Content-Type: application/json

{ "status": "shipped" }
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Order not found!" }`

---

## ORD-008 — Change order status: invalid / missing status value

**Priority:** High

**Preconditions:** Admin logged in; `{{orderId}}` exists.

**Cases:**

| Body | Expected |
|------|----------|
| `{ "status": "flying" }` | `4xx`/`5xx` — Mongoose enum `ValidationError` on `save()` (not in allowed set) |
| `{}` (missing status) | `order.status` set to `undefined`; Mongoose keeps existing default → may save with no change or throw on required path |
| `{ "status": "" }` | enum validation error |
| `{ "status": 123 }` | cast/enum validation error |

**Request example:**
```
PATCH {{baseUrl}}/order/{{orderId}}
Cookie: authToken={{adminToken}}
Content-Type: application/json

{ "status": "flying" }
```

**Description:** There is no request-body validation middleware — only the schema enum guards values (ORDER bug #2).

---

## ORD-009 — No direct order creation endpoint exists

**Priority:** Critical

**Request:**
```
POST {{baseUrl}}/order/
Cookie: authToken={{accessToken}}
Content-Type: application/json

{ "products": [ ... ], "totalAmount": 100 }
```

**Error Response:**
- Status: `404` (Express "Cannot POST /api/v1/order/" — no such route) handled by the global error handler.

**Description:** Verifies an order **cannot** be created via a public API — the only path is the Stripe webhook after a paid checkout. This enforces "no order without successful payment."

---

## ORD-010 — Order is created only after successful payment (webhook)

**Priority:** Critical

**Preconditions:** A `Payment` exists with `status: "pending"` and a valid `stripeSessionId`.

**Flow:**
1. `POST {{baseUrl}}/payment/checkout` → creates a `pending` Payment (no Order yet).
2. Stripe sends `checkout.session.completed` with `payment_status: "paid"` to `POST {{baseUrl}}/payment/webhook`.
3. The webhook creates the `Order` from `payment.sellerDistributions`, decrements product stock, and marks the Payment `succeeded`.

**Expected Result:**
- Before the webhook: `GET /order/` does **not** contain the order.
- After the webhook: a new Order appears with `userId`, `userInfo`, `products`, `totalAmount`, `paymentId` and default `status: "confirmed"`.

**Description:** Confirms the create path runs only on a paid session. See PAY-012.

---

## ORD-011 — Duplicate order from one payment (idempotency check)

**Priority:** Critical

**Preconditions:** A Payment whose webhook already produced an Order.

**Request:** Stripe re-delivers the same `checkout.session.completed` event (same `session.id`) to `POST {{baseUrl}}/payment/webhook`.

**Current behavior:**
- The webhook finds the Payment by `stripeSessionId` and **creates another Order** — it does **not** guard on `payment.webhookProcessed` / `payment.status === "succeeded"` before creating the order.
- Result: a **second** Order is created for the same payment, and stock is decremented again.

**Expected (desired) behavior:**
- The webhook should short-circuit when `payment.webhookProcessed === true` (or `status === "succeeded"`) and return `{ "received": true }` without creating a duplicate order.

**Description:** Documents a **missing idempotency guard** — important regression test for webhook retries.

---

## ORD-012 — Delete order: success (owner)

**Priority:** Critical

**Preconditions:** `{{orderId}}` belongs to the logged-in user.

**Request:**
```
DELETE {{baseUrl}}/order/{{orderId}}
Cookie: authToken={{accessToken}}
```

**Success Response:**
- Status: `200`
- Body: `{ "status": "success", "message": "Order deleted successfully!" }`

**Description:** Owner deletes their own order.

---

## ORD-013 — Delete order: not the owner (forbidden)

**Priority:** Critical

**Preconditions:** `{{orderId}}` belongs to a **different** user (test with an admin token too — admins are NOT exempt here).

**Request:**
```
DELETE {{baseUrl}}/order/{{orderId}}
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You cant delete this order!" }`

**Description:** Delete is restricted to the order owner (`order.userId === req.user._id`); there is **no admin override** on delete.

---

## ORD-014 — Delete order: not found

**Priority:** High

**Request:**
```
DELETE {{baseUrl}}/order/000000000000000000000000
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Order not found!" }`

---

## ORD-015 — Delete order: invalid ObjectId

**Priority:** Medium

**Request:**
```
DELETE {{baseUrl}}/order/not-a-valid-id
Cookie: authToken={{accessToken}}
```

**Error Response:**
- Status: `500` — Mongoose `CastError`; no id-format validation on the route.

---

## ORD-016 — Delete order: rate limit exceeded (> 10 in 10 min)

**Priority:** Medium

**Request:** Repeat `DELETE {{baseUrl}}/order/{{orderId}}` an 11th time within 10 minutes.

**Error Response:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many delete requests. Please try again later." }`

---

## ORD-017 — Change order status: rate limit exceeded (> 15 in 10 min)

**Priority:** Low

**Request:** Repeat `PATCH {{baseUrl}}/order/{{orderId}}` (admin) a 16th time within 10 minutes.

**Error Response:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many edit requests. Please try again later." }`

---

## ORD-018 — Orders: JWT tampered / expired

**Priority:** High

**Request:**
```
GET {{baseUrl}}/order/
Cookie: authToken=eyJhbGciOiJIUzI1NiJ9.TAMPERED.SIG
```

**Expected Result:**
- Status: `4xx`/`5xx` — `jwt.verify` throws in `protect` before any controller runs.

**Description:** JWT validity is enforced on every order route.
