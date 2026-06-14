# Users Test Cases

Base path: `/api/v1/user`

> **Bug note (USER controller):**
> - `deleteUser` has an inverted OR condition: `user._id !== req.user._id || req.user.role !== "admin"` — admins cannot delete other users' accounts (should be `&&`)
> - `changeRole` has a logic bug: `role !== "user" || role !== "seller" || role !== "admin"` is always `true` — every valid role value is rejected (should be `&&`)

---

## USER-001 — Get Users: successful paginated list

**Priority:** High

**Preconditions:** At least one user exists in DB.

**Request:**
```
GET /api/v1/user?page=1&limit=10
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Users returned successfully!",
  "data": {
    "users": [ { "_id": "...", "fullname": "...", "email": "...", "role": "...", "isVerified": true, ... } ]
  }
}
```
- `password` field is NOT returned (not selected)
- Max 10 users returned

---

## USER-002 — Get Users: no query params (page/limit undefined)

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/user
```

**Expected Result:**
- Status: `200` or potential NaN issue (`(undefined - 1) * undefined = NaN`)
- Mongoose `.skip(NaN)` behaves as `.skip(0)` and `.limit(undefined)` returns all documents
- No crash; returns all users

---

## USER-003 — Get Users: page=0 (edge case)

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/user?page=0&limit=10
```

**Expected Result:**
- Status: `200`
- `.skip((0-1)*10) = .skip(-10)` → Mongoose treats negative skip as 0 → returns first 10

---

## USER-004 — Get Users: very large page (no results)

**Priority:** Low

**Preconditions:** DB has fewer than 1000 users.

**Request:**
```
GET /api/v1/user?page=1000&limit=10
```

**Expected Result:**
- Status: `200`
- Body: `{ "data": { "users": [] } }`

---

## USER-005 — Get Users: public endpoint (no auth required)

**Priority:** High

**Preconditions:** No auth cookie set.

**Request:**
```
GET /api/v1/user?page=1&limit=5
```

**Expected Result:**
- Status: `200`
- Users returned without authentication

---

## USER-006 — Delete User: owner deletes own account

**Priority:** Critical

**Preconditions:** User logged in. `userId` matches logged-in user's `_id`.

**Request:**
```
DELETE /api/v1/user/<own_userId>
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "User deleted successfully!" }`
- User's `isDeleted` set to `true`, `deletedAt` set to current date (soft delete)
- User can no longer login (AUTH-019)

---

## USER-007 — Delete User: user tries to delete another user (access denied)

**Priority:** Critical

**Preconditions:** User A logged in. `userId` belongs to User B.

**Request:**
```
DELETE /api/v1/user/<other_userId>
Cookie: authToken=<user_A_jwt>
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

---

## USER-008 — Delete User: admin deletes another user [BUG]

**Priority:** Critical

**Preconditions:** Admin logged in. `userId` belongs to a regular user.

**Request:**
```
DELETE /api/v1/user/<other_userId>
Cookie: authToken=<admin_jwt>
```

**Expected Result (current buggy behavior):**
- Status: `401` — Access denied (because `user._id !== req.user._id` is `true` for different users, and the OR condition fires)

**Expected Result (after bug fix):**
- Status: `200` — Admin should be able to delete any user

---

## USER-009 — Delete User: non-existent userId

**Priority:** High

**Preconditions:** User logged in. Provided ObjectId does not match any user.

**Request:**
```
DELETE /api/v1/user/000000000000000000000000
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "User not found!" }`

---

## USER-010 — Delete User: without auth cookie

**Priority:** High

**Preconditions:** No auth cookie.

**Request:**
```
DELETE /api/v1/user/<userId>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## USER-011 — Delete User: invalid ObjectId format

**Priority:** Medium

**Preconditions:** User logged in.

**Request:**
```
DELETE /api/v1/user/not-a-valid-id
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `5xx` (MongoDB CastError — no ID format validation in this route)

---

## USER-012 — Edit User: update fullname successfully

**Priority:** Critical

**Preconditions:** User logged in. `userId` matches logged-in user's `_id`.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

fullname=Updated Name
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "User information edited successfully!",
  "data": { "user": { "fullname": "Updated Name", ... } }
}
```
- `password` NOT in response

---

## USER-013 — Edit User: update email (triggers re-verification)

**Priority:** Critical

**Preconditions:** User logged in; account is verified (`isVerified: true`).

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

email=newemail@example.com
```

**Expected Result:**
- Status: `200`
- User's `email` updated, `isVerified` set to `false`
- Verification email sent to `newemail@example.com`

---

## USER-014 — Edit User: change password with correct current password

**Priority:** Critical

**Preconditions:** User logged in; knows current password.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

currentPassword=OldPassword123
newPassword=NewPassword456
```

**Expected Result:**
- Status: `200`
- Password updated in DB (bcrypt hash stored)
- Login with old password no longer works
- Login with new password works

---

## USER-015 — Edit User: change password with wrong current password

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

currentPassword=WrongPassword
newPassword=NewPassword456
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Current password is incorrect!" }`

---

## USER-016 — Edit User: upload avatar image

**Priority:** High

**Preconditions:** User logged in; Cloudinary configured.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

image=<valid_image_file>
```

**Expected Result:**
- Status: `200`
- `user.avatar.url` contains Cloudinary URL
- `user.avatar.public_id` set
- Old avatar deleted from Cloudinary (if existed)

---

## USER-017 — Edit User: user tries to edit another user's profile

**Priority:** Critical

**Preconditions:** User A logged in. `userId` belongs to User B.

**Request:**
```
PATCH /api/v1/user/edit-user/<user_B_id>
Cookie: authToken=<user_A_jwt>
Content-Type: multipart/form-data

fullname=Hacker
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You can't edit information of this user!" }`

---

## USER-018 — Edit User: fullname too short (< 5 chars)

**Priority:** High

**Preconditions:** User logged in.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

fullname=Jo
```

**Expected Result:**
- Status: `400`
- Body contains: `"Fullname must contain at least 5 characters!"`

---

## USER-019 — Edit User: unknown extra field (strict schema)

**Priority:** Medium

**Preconditions:** User logged in.

**Request:**
```
PATCH /api/v1/user/edit-user/<own_userId>
Cookie: authToken=<valid_jwt>
Content-Type: multipart/form-data

role=admin
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Unknown fields are not allowed!" }`

---

## USER-020 — Edit User: without auth cookie

**Priority:** High

**Request:**
```
PATCH /api/v1/user/edit-user/<userId>
Content-Type: multipart/form-data

fullname=Test
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## USER-021 — Change Role: admin changes user to seller

**Priority:** High

**Preconditions:** Admin logged in. `userId` belongs to a regular user.

**Request:**
```
PATCH /api/v1/user/change-role/<userId>
Cookie: authToken=<admin_jwt>
Content-Type: application/json

{
  "role": "seller"
}
```

**Expected Result (after bug fix):**
- Status: `200`
- User's `role` updated to `"seller"`

**Expected Result (current buggy behavior):**
- Status: `404` — always fails because `role !== "seller"` is `false` but OR logic makes condition `true` for any valid value

---

## USER-022 — Change Role: admin tries to change another admin's role

**Priority:** High

**Preconditions:** Admin A logged in. `userId` belongs to Admin B.

**Request:**
```
PATCH /api/v1/user/change-role/<admin_B_id>
Cookie: authToken=<admin_A_jwt>
Content-Type: application/json

{
  "role": "user"
}
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }` (target user is admin → blocked)

---

## USER-023 — Change Role: non-admin tries to change role

**Priority:** Critical

**Preconditions:** Regular user logged in.

**Request:**
```
PATCH /api/v1/user/change-role/<any_userId>
Cookie: authToken=<user_jwt>
Content-Type: application/json

{
  "role": "admin"
}
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }` (allowedTo("admin") middleware)

---

## USER-024 — Change Role: non-existent user

**Priority:** Medium

**Preconditions:** Admin logged in.

**Request:**
```
PATCH /api/v1/user/change-role/000000000000000000000000
Cookie: authToken=<admin_jwt>
Content-Type: application/json

{
  "role": "seller"
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "User not found!" }`

---

## USER-025 — Change Role: invalid role value

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
PATCH /api/v1/user/change-role/<userId>
Cookie: authToken=<admin_jwt>
Content-Type: application/json

{
  "role": "superadmin"
}
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Wrong Data!" }` (buggy logic fires for any string)

---

## USER-026 — Change Role: without auth cookie

**Priority:** High

**Request:**
```
PATCH /api/v1/user/change-role/<userId>
Content-Type: application/json

{ "role": "seller" }
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`
