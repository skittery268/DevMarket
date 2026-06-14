# Chat Test Cases

Base path: `/api/v1/chat`

> **Bug note (CHAT):**
> `GET /api/v1/chat` is defined **before** `chatRouter.use(protect)`, so the `protect` middleware does NOT apply to it. The controller `getChats` accesses `req.user._id` which will be `undefined` for unauthenticated requests, causing a runtime error.

---

## CHAT-001 — Get Chats: authenticated user gets own chats

**Priority:** Critical

**Preconditions:** User logged in; at least one chat exists where user is buyer or seller.

**Request:**
```
GET /api/v1/chat
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Chats returned successfully!",
  "data": {
    "chats": [
      {
        "_id": "...",
        "product": { "_id": "...", "universal": { "title": "..." } },
        "seller": { "_id": "...", "fullname": "..." },
        "buyer": { "_id": "...", "fullname": "..." },
        "lastMessage": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```
- Only chats where `seller == req.user._id` OR `buyer == req.user._id` are returned
- Sorted by `updatedAt` descending

---

## CHAT-002 — Get Chats: no auth cookie [BUG]

**Priority:** Critical

**Preconditions:** No auth cookie set.

**Request:**
```
GET /api/v1/chat
```

**Expected Result (current buggy behavior):**
- Status: `500`
- `TypeError: Cannot read properties of undefined (reading '_id')` because `req.user` is `undefined`

**Expected Result (after fix — add `protect` before route):**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## CHAT-003 — Get Chats: user with no chats

**Priority:** Medium

**Preconditions:** User logged in; no chats exist for this user.

**Request:**
```
GET /api/v1/chat
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "data": { "chats": [] } }`

---

## CHAT-004 — Create Chat: buyer initiates chat with seller about product

**Priority:** Critical

**Preconditions:** Buyer logged in; valid `productId` and `sellerId` provided.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `201`
- Body:
```json
{
  "status": "success",
  "message": "Chat created successfully!",
  "data": {
    "chat": {
      "_id": "...",
      "product": { "_id": "...", "universal": { "title": "..." } },
      "seller": { "_id": "...", "fullname": "..." },
      "buyer": { "_id": "...", "fullname": "..." }
    }
  }
}
```

---

## CHAT-005 — Create Chat: idempotency (same chat requested twice)

**Priority:** High

**Preconditions:** Buyer logged in; chat with same `productId + sellerId + buyerId` already exists.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<buyer_jwt>
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `201`
- Returns the **existing** chat (no duplicate created)
- DB still has exactly one chat with this combination

---

## CHAT-006 — Create Chat: invalid productId format

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "productId": "not-a-valid-objectid",
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Invalid ID!"`

---

## CHAT-007 — Create Chat: invalid sellerId format

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "sellerId": "bad-id"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Invalid ID!"`

---

## CHAT-008 — Create Chat: missing productId

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `400`
- Zod validation error for missing `productId`

---

## CHAT-009 — Create Chat: missing sellerId

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1"
}
```

**Expected Result:**
- Status: `400`
- Zod validation error for missing `sellerId`

---

## CHAT-010 — Create Chat: unknown extra field (strict schema)

**Priority:** Medium

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2",
  "message": "Hi there"
}
```

**Expected Result:**
- Status: `400`
- Body: `"Unknown fields are not allowed!"`

---

## CHAT-011 — Create Chat: without auth cookie

**Priority:** High

**Request:**
```
POST /api/v1/chat
Content-Type: application/json

{
  "productId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## CHAT-012 — Create Chat: NoSQL injection in productId

**Priority:** Critical

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/chat
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "productId": { "$gt": "" },
  "sellerId": "64f1b2c3d4e5f6a7b8c9d0e2"
}
```

**Expected Result:**
- Status: `400`
- Zod `objectId` refine rejects non-string; sanitizer replaces `$`

---

## CHAT-013 — Delete Chat: user deletes own chat

**Priority:** Critical

**Preconditions:** User logged in; `chatId` exists; user is buyer or seller in the chat.

**Request:**
```
DELETE /api/v1/chat/<chatId>
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "Chat deleted successfully!" }`
- Chat removed from DB
- All associated messages deleted (`Message.deleteMany({ chat: chatId })`)

---

## CHAT-014 — Delete Chat: non-existent chatId

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
DELETE /api/v1/chat/000000000000000000000000
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Chat not found!" }`

---

## CHAT-015 — Delete Chat: user deletes another user's chat [no ownership check]

**Priority:** High

**Preconditions:** User A logged in. `chatId` belongs to a chat between User B and Seller C.

**Request:**
```
DELETE /api/v1/chat/<chatId_not_owned_by_A>
Cookie: authToken=<user_A_jwt>
```

**Expected Result (current behavior):**
- Status: `200` — Controller does NOT check chat ownership before deleting
- This is a **security vulnerability** — any authenticated user can delete any chat

---

## CHAT-016 — Delete Chat: without auth cookie

**Priority:** High

**Request:**
```
DELETE /api/v1/chat/<chatId>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`
