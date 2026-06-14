# Search Test Cases

Base path: `/api/v1/search`

**Auth required:** No (all search endpoints are public)
**Note:** Search controllers use MongoDB `$regex` without escaping user input — a potential ReDoS vector.

---

## SRCH-001 — Search Users: find by fullname (exact match)

**Priority:** High

**Preconditions:** User with fullname "John Doe" exists in DB.

**Request:**
```
GET /api/v1/search/users?fullname=John
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Users returned successfully!",
  "results": 1,
  "data": {
    "users": [{ "_id": "...", "fullname": "John Doe", "email": "..." }]
  }
}
```
- Case-insensitive search (`$options: "i"`)

> **Bug note:** Controller searches `{ name: { $regex: fullname } }` but User model field is `fullname`, not `name` → always returns empty array regardless of input.

---

## SRCH-002 — Search Users: bug — wrong field name in query

**Priority:** Critical

**Preconditions:** User with fullname "Jane Smith" exists in DB.

**Request:**
```
GET /api/v1/search/users?fullname=Jane
```

**Expected Result (current buggy behavior):**
- Status: `200`
- Body: `{ "results": 0, "data": { "users": [] } }`
- Query uses `name` but schema field is `fullname` → never matches

**Expected Result (after fix):**
- Returns matching users

---

## SRCH-003 — Search Users: empty fullname param

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/users?fullname=
```

**Expected Result:**
- Status: `200`
- Empty regex matches all users → returns all users in DB
- Potential performance issue on large DBs

---

## SRCH-004 — Search Users: no fullname param

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/users
```

**Expected Result:**
- Status: `200` or `5xx`
- `fullname` is `undefined` → `$regex: undefined` → MongoDB may error or return all documents

---

## SRCH-005 — Search Users: ReDoS in fullname

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/users?fullname=((a+)+)+b
```

**Expected Result:**
- Server should handle gracefully; ideally sanitize/escape regex special chars
- Currently vulnerable: user-controlled input passed directly to `$regex`

---

## SRCH-006 — Search Users: NoSQL injection via fullname

**Priority:** Critical

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/users?fullname[$gt]=
```

**Expected Result:**
- `express-mongo-sanitize` replaces `$` in query params with `_`
- `fullname` becomes `_gt` (string) or similar; no operator injection

---

## SRCH-007 — Search Products: find by title

**Priority:** Critical

**Preconditions:** Product with title "Gaming Laptop" exists in DB.

**Request:**
```
GET /api/v1/search/products?title=Gaming
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Products returned successfully!",
  "results": 1,
  "data": {
    "products": [
      {
        "universal": {
          "title": "Gaming Laptop",
          "description": "...",
          "category": { "name": "..." },
          "sellerId": { "fullname": "..." }
        }
      }
    ]
  }
}
```
- Searches both `universal.title` AND `universal.description` (OR condition)

---

## SRCH-008 — Search Products: find by description keyword

**Priority:** High

**Preconditions:** Product with description containing "wireless" exists.

**Request:**
```
GET /api/v1/search/products?title=wireless
```

**Expected Result:**
- Status: `200`
- Returns products where description matches "wireless" (case-insensitive)
- `title` param is used for both title and description search

---

## SRCH-009 — Search Products: no results

**Priority:** Medium

**Preconditions:** No product contains "xyznonexistentterm" in title or description.

**Request:**
```
GET /api/v1/search/products?title=xyznonexistentterm
```

**Expected Result:**
- Status: `200`
- Body: `{ "results": 0, "data": { "products": [] } }`

---

## SRCH-010 — Search Products: empty title param

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/products?title=
```

**Expected Result:**
- Status: `200`
- Empty regex matches all products → returns all products

---

## SRCH-011 — Search Products: no title param

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/products
```

**Expected Result:**
- Status: `200` or `5xx`
- `title` is `undefined` → `$regex: undefined` behavior depends on MongoDB driver version

---

## SRCH-012 — Search Products: special regex characters in title

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/products?title=.*
```

**Expected Result:**
- Status: `200`
- `.*` matches everything → returns all products
- No escaping of regex metacharacters

---

## SRCH-013 — Search Products: ReDoS attack

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/products?title=((a+)+)+$
```

**Expected Result:**
- Server should not hang; query should time out or be rejected
- Currently vulnerable to catastrophic backtracking

---

## SRCH-014 — Search Categories: find by name

**Priority:** Critical

**Preconditions:** Category with name "Electronics" exists.

**Request:**
```
GET /api/v1/search/categories?name=Electr
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Categories returned successfully!",
  "results": 1,
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Electronics",
        "description": "...",
        "parentCategory": null,
        "isActive": true
      }
    ]
  }
}
```
- Searches both `name` AND `description` (OR condition)
- Case-insensitive

---

## SRCH-015 — Search Categories: find by description keyword

**Priority:** High

**Preconditions:** Category with description containing "gadgets" exists.

**Request:**
```
GET /api/v1/search/categories?name=gadgets
```

**Expected Result:**
- Status: `200`
- Returns matching categories (description match)

---

## SRCH-016 — Search Categories: no results

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/categories?name=zzznomatch
```

**Expected Result:**
- Status: `200`
- Body: `{ "results": 0, "data": { "categories": [] } }`

---

## SRCH-017 — Search Categories: empty name param

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/search/categories?name=
```

**Expected Result:**
- Status: `200`
- Empty regex matches all → returns all categories

---

## SRCH-018 — Search: global rate limit enforcement

**Priority:** Medium

**Preconditions:** 200 requests already sent from same IP within 15 minutes.

**Request:**
```
GET /api/v1/search/products?title=test
```

**Expected Result:**
- Status: `429`
- Body: `{ "status": "fail", "message": "Too many requests. Please try again later." }`
