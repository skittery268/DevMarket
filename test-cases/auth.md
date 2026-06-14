# Auth Test Cases

Base path: `/api/v1/auth`

---

## AUTH-001 — Register: successful registration

**Priority:** Critical

**Preconditions:** Email does not exist in DB.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `201 Created`
- Body:
```json
{
  "status": "success",
  "message": "User registered successfully!"
}
```
- Verification email sent to `john.doe@example.com`
- User stored in DB with `isVerified: false`, `role: "user"`, `provider: "local"`
- `fullname` is capitalized: `"John doe"` → stored as `"John doe"` (first letter uppercase)

---

## AUTH-002 — Register: duplicate email

**Priority:** Critical

**Preconditions:** User with `john.doe@example.com` already exists in DB.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "Jane Smith",
  "email": "john.doe@example.com",
  "password": "Password456"
}
```

**Expected Result:**
- Status: `4xx`
- Body contains error about duplicate email (MongoDB unique constraint)

---

## AUTH-003 — Register: invalid email format

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "not-an-email",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Body:
```json
{
  "status": "fail",
  "message": "Invalid email address!"
}
```

---

## AUTH-004 — Register: fullname too short (< 5 chars)

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "Jo",
  "email": "valid@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Fullname must contain at least 5 characters!"`

---

## AUTH-005 — Register: fullname too long (> 50 chars)

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEEFFFFF",
  "email": "valid@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Fullname is too long!"`

---

## AUTH-006 — Register: password too short (< 8 chars)

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "valid@example.com",
  "password": "Pass1"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Password must contain at least 8 characters!"`

---

## AUTH-007 — Register: password too long (> 50 chars)

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "valid@example.com",
  "password": "AAAAAAAAAAAABBBBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE1"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Password is too long!"`

---

## AUTH-008 — Register: missing required fields

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "valid@example.com"
}
```

**Expected Result:**
- Status: `400`
- Zod validation error for missing `fullname` and `password`

---

## AUTH-009 — Register: unknown extra field (strict schema)

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "valid@example.com",
  "password": "Password123",
  "role": "admin"
}
```

**Expected Result:**
- Status: `400`
- Body contains: `"Unknown fields are not allowed!"`

---

## AUTH-010 — Register: empty body

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{}
```

**Expected Result:**
- Status: `400`
- Validation errors for all required fields

---

## AUTH-011 — Register: invalid Content-Type

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: text/plain

fullname=John Doe&email=test@example.com&password=Password123
```

**Expected Result:**
- Status: `400`
- Body is empty or validation fails (Express does not parse non-JSON body by default)

---

## AUTH-012 — Register: NoSQL injection in email

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": { "$gt": "" },
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Zod rejects non-string email; `express-mongo-sanitize` replaces `$` with `_`
- No database access with operator

---

## AUTH-013 — Register: XSS in fullname

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "<script>alert(1)</script>",
  "email": "xss@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Registration may succeed (server does not HTML-encode), but the script should never be executed in a JSON API response
- Verify the value is stored as a plain string and not executed

---

## AUTH-014 — Register: rate limit exceeded (> 5 in 60 min)

**Priority:** High

**Preconditions:** 5 registration requests already sent from same IP within 60 minutes.

**Request:**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "Rate Test",
  "email": "rate6@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `429 Too Many Requests`
- Body:
```json
{
  "status": "fail",
  "message": "Too many register requests. Please try again later."
}
```

---

## AUTH-015 — Login: successful login

**Priority:** Critical

**Preconditions:** User registered and email verified.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `200 OK`
- Body:
```json
{
  "status": "success",
  "message": "Login successfully!",
  "data": {
    "user": { "_id": "...", "fullname": "...", "email": "...", "role": "user", ... }
  }
}
```
- `password` field is NOT present in response
- Response sets `Set-Cookie: authToken=<jwt>; HttpOnly; SameSite=...`

---

## AUTH-016 — Login: wrong password

**Priority:** Critical

**Preconditions:** User exists and is verified.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "WrongPassword"
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Credentials incorrect!" }`

---

## AUTH-017 — Login: non-existent email

**Priority:** High

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nobody@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Credentials incorrect!" }`

---

## AUTH-018 — Login: unverified account

**Priority:** Critical

**Preconditions:** User registered but email NOT verified.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "unverified@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Please complete verification first." }`

---

## AUTH-019 — Login: soft-deleted account

**Priority:** High

**Preconditions:** User account has `isDeleted: true`.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "deleted@example.com",
  "password": "Password123"
}
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "This account has been deleted!" }`

---

## AUTH-020 — Login: rate limit exceeded (> 5 in 15 min)

**Priority:** High

**Preconditions:** 5 login attempts already made from same IP within 15 minutes.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "any@example.com",
  "password": "anypassword"
}
```

**Expected Result:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many login requests. Please try again later." }`

---

## AUTH-021 — Login: empty body

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{}
```

**Expected Result:**
- Status: `400`
- Validation errors for `email` and `password`

---

## AUTH-022 — Login: NoSQL injection attempt

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
```

**Expected Result:**
- Status: `400`
- Zod rejects non-string values; sanitizer replaces `$` → `_`
- No successful authentication bypass

---

## AUTH-023 — Email Verification: valid token

**Priority:** Critical

**Preconditions:** User registered; valid verification token exists in DB.

**Request:**
```
GET /api/v1/auth/verification?token=<valid_jwt_token>
```

**Expected Result:**
- Status: `200`
- Response HTML: `<h1>Verification successfully, you can come back!</h1>`
- User `isVerified` set to `true` in DB

---

## AUTH-024 — Email Verification: missing token

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/auth/verification
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Token is required!" }`

---

## AUTH-025 — Email Verification: invalid/tampered token

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/auth/verification?token=invalid.token.here
```

**Expected Result:**
- Status: `400` or `500`
- Body contains error about invalid token

---

## AUTH-026 — Email Verification: expired token

**Priority:** High

**Preconditions:** Token signed with `expiresIn: "1d"` and more than 24 hours have passed.

**Request:**
```
GET /api/v1/auth/verification?token=<expired_jwt>
```

**Expected Result:**
- Status: `4xx` or `5xx`
- `jwt.verify` throws `TokenExpiredError`

---

## AUTH-027 — Email Verification: already verified account

**Priority:** Medium

**Preconditions:** User account already has `isVerified: true`.

**Request:**
```
GET /api/v1/auth/verification?token=<valid_token_for_already_verified_user>
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "Your account already varified!" }`

---

## AUTH-028 — Get Me: with valid cookie

**Priority:** Critical

**Preconditions:** User logged in; `authToken` cookie is set.

**Request:**
```
GET /api/v1/auth/me
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Auto login successfully!",
  "data": { "user": { "_id": "...", "fullname": "...", ... } }
}
```
- `password` field NOT present

---

## AUTH-029 — Get Me: without cookie

**Priority:** Critical

**Preconditions:** No auth cookie set.

**Request:**
```
GET /api/v1/auth/me
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## AUTH-030 — Get Me: expired JWT in cookie

**Priority:** High

**Preconditions:** Cookie contains JWT with expired `exp` claim.

**Request:**
```
GET /api/v1/auth/me
Cookie: authToken=<expired_jwt>
```

**Expected Result:**
- Status: `4xx` or `5xx`
- `jwt.verify` throws; error propagated by `catchAsync`

---

## AUTH-031 — Get Me: tampered JWT in cookie

**Priority:** High

**Preconditions:** Cookie value is a JWT with modified payload/signature.

**Request:**
```
GET /api/v1/auth/me
Cookie: authToken=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJmYWtlIn0.FAKESIG
```

**Expected Result:**
- Status: `4xx`
- JWT signature verification fails

---

## AUTH-032 — Logout: successful logout

**Priority:** Critical

**Preconditions:** User logged in with valid cookie.

**Request:**
```
POST /api/v1/auth/logout
Cookie: authToken=<valid_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "Logout successfully!" }`
- Response clears `authToken` cookie (`Set-Cookie: authToken=; Max-Age=0; ...`)

---

## AUTH-033 — Logout: without cookie

**Priority:** Medium

**Preconditions:** No auth cookie set.

**Request:**
```
POST /api/v1/auth/logout
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## AUTH-034 — Google OAuth: initiate flow

**Priority:** High

**Preconditions:** Google OAuth credentials configured in `.env`.

**Request:**
```
GET /api/v1/auth/google
```

**Expected Result:**
- Status: `302 Found`
- Redirect to Google accounts login page
- Scope includes `profile` and `email`

---

## AUTH-035 — Google OAuth: callback sets cookie and redirects

**Priority:** High

**Preconditions:** Successful Google auth; passport returns user.

**Request:**
```
GET /api/v1/auth/google/callback?code=<google_code>&state=<state>
```

**Expected Result:**
- Status: `302`
- Sets `authToken` cookie
- Redirects to `CLIENT_URL`
