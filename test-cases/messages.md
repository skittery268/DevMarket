# Messages Test Cases

Base path: `/api/v1/message`

> **Bug note (MESSAGE):**
> 1. `GET /api/v1/message` is defined **before** `messageRouter.use(protect)`, so it is **not protected**.
> 2. `getMessages` controller uses `req.params.chatId` but the route is `GET /` with no `:chatId` URL parameter → `chatId` will always be `undefined` → queries all messages with `chat: undefined` → always returns empty array.
> 3. `sendMessage` uses `req.params.chatId` but route is `POST /` with no `:chatId` → creates messages with `chat: undefined`.
> All three routes likely need `chatId` from `req.query` (or possibly route needs redesign to `GET /:chatId/messages`).

---

## MSG-001 — Get Messages: fetch messages for a chat

**Priority:** Critical

**Preconditions:** Chat exists with messages. (After bug fix: `chatId` passed as query param.)

**Request:**
```
GET /api/v1/message?chatId=<chatId>
Cookie: authToken=<valid_jwt>
```

**Expected Result (after bug fix):**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Messages returned successfully!",
  "data": {
    "messages": [
      {
        "_id": "...",
        "chat": "...",
        "sender": { "_id": "...", "fullname": "..." },
        "content": "Hello!",
        "isRead": false,
        "createdAt": "..."
      }
    ]
  }
}
```
- Sorted by `createdAt` ascending
- `sender` is populated

---

## MSG-002 — Get Messages: without chatId [BUG]

**Priority:** Critical

**Preconditions:** Messages exist in DB.

**Request:**
```
GET /api/v1/message
```

**Expected Result (current buggy behavior):**
- Status: `200`
- `chatId` is always `undefined` from `req.params`
- Returns empty array (or all messages with `chat: undefined`)

---

## MSG-003 — Get Messages: public endpoint (no auth) [BUG]

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/message?chatId=<chatId>
```

**Expected Result (current buggy behavior):**
- Status: `200`
- No auth required — any unauthenticated request can read messages

**Expected Result (after fix):**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## MSG-004 — Send Message: successful send

**Priority:** Critical

**Preconditions:** User logged in; valid `chatId` provided in body (after bug fix).

**Request:**
```
POST /api/v1/message
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "chatId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "content": "Hello, is this item still available?"
}
```

**Expected Result (after bug fix):**
- Status: `201`
- Body:
```json
{
  "status": "success",
  "message": "Message sent successfully!",
  "data": {
    "message": {
      "_id": "...",
      "chat": "...",
      "sender": { "_id": "...", "fullname": "..." },
      "content": "Hello, is this item still available?",
      "isRead": false
    }
  }
}
```
- Socket.io event `newMessage` emitted to the chat room
- `Chat.lastMessage` updated to this message's `_id`

---

## MSG-005 — Send Message: without auth cookie

**Priority:** High

**Request:**
```
POST /api/v1/message
Content-Type: application/json

{
  "content": "Hello"
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## MSG-006 — Send Message: empty content

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/message
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "content": ""
}
```

**Expected Result:**
- Status: `4xx` — Mongoose `required: true` for `content` (or business logic validation)

---

## MSG-007 — Send Message: missing content field

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
POST /api/v1/message
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{}
```

**Expected Result:**
- Status: `4xx`
- Mongoose validation: `"Message content is required!"`

---

## MSG-008 — Delete Message: sender deletes own message

**Priority:** Critical

**Preconditions:** User logged in; `messageId` belongs to a message sent by the logged-in user.

**Request:**
```
DELETE /api/v1/message/<messageId>
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "Message deleted successfully!" }`
- Message removed from DB
- Socket.io event `deleteMessage` emitted to the chat room with `messageId`

---

## MSG-009 — Delete Message: user tries to delete another user's message

**Priority:** Critical

**Preconditions:** User A logged in. `messageId` was sent by User B.

**Request:**
```
DELETE /api/v1/message/<user_B_messageId>
Cookie: authToken=<user_A_jwt>
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You can't delete this message!" }`

---

## MSG-010 — Delete Message: non-existent messageId

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
DELETE /api/v1/message/000000000000000000000000
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Message not found!" }`

---

## MSG-011 — Delete Message: without auth cookie

**Priority:** High

**Request:**
```
DELETE /api/v1/message/<messageId>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## MSG-012 — Delete Message: invalid ObjectId format

**Priority:** Medium

**Preconditions:** User logged in.

**Request:**
```
DELETE /api/v1/message/not-a-valid-id
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `5xx` — MongoDB CastError

---

## MSG-013 — Edit Message: sender edits own message

**Priority:** Critical

**Preconditions:** User logged in; `messageId` belongs to the logged-in user.

**Request:**
```
PATCH /api/v1/message/<messageId>
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "content": "Updated message content"
}
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Message updated successfully!",
  "data": {
    "message": {
      "_id": "...",
      "content": "Updated message content",
      "sender": { "_id": "...", "fullname": "..." }
    }
  }
}
```
- Socket.io event `editMessage` emitted to the chat room

---

## MSG-014 — Edit Message: user tries to edit another user's message

**Priority:** Critical

**Preconditions:** User A logged in. `messageId` belongs to User B.

**Request:**
```
PATCH /api/v1/message/<user_B_messageId>
Cookie: authToken=<user_A_jwt>
Content-Type: application/json

{
  "content": "Hacked content"
}
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You can't edit this message!" }`

---

## MSG-015 — Edit Message: non-existent messageId

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
PATCH /api/v1/message/000000000000000000000000
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "content": "Update"
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Message not found!" }`

---

## MSG-016 — Edit Message: empty content (no update applied)

**Priority:** Medium

**Preconditions:** User logged in; message exists.

**Request:**
```
PATCH /api/v1/message/<messageId>
Cookie: authToken=<valid_jwt>
Content-Type: application/json

{
  "content": ""
}
```

**Expected Result:**
- Status: `200`
- `content` is falsy so `if (content)` block skipped — message content NOT updated, old content preserved

---

## MSG-017 — Edit Message: without auth cookie

**Priority:** High

**Request:**
```
PATCH /api/v1/message/<messageId>
Content-Type: application/json

{ "content": "New content" }
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`
