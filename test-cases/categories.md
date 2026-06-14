# Categories Test Cases

Base path: `/api/v1/category`

**Auth required for write operations:** Yes (`protect` + `allowedTo("admin")`)
**File upload:** Multipart form-data, field name `image`, single file
**Note:** `createCategory` always crashes if no file is uploaded (accesses `req.file.buffer` without null check)

---

## CAT-001 — Get Categories: successful paginated list

**Priority:** Critical

**Preconditions:** At least one category exists in DB.

**Request:**
```
GET /api/v1/category?page=1&limit=10
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Categories returned successfully!",
  "categoryCount": 5,
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Electronics",
        "description": "...",
        "image": { "url": "https://...", "public_id": "..." },
        "isActive": true,
        "parentCategory": null,
        "allowedAttributes": ["brand", "color"]
      }
    ]
  }
}
```
- `parentCategory` is populated (when set)
- Sorted by `createdAt` descending

---

## CAT-002 — Get Categories: public endpoint (no auth required)

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/category?page=1&limit=5
```

**Expected Result:**
- Status: `200`
- No auth cookie required

---

## CAT-003 — Get Categories: no query params

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/category
```

**Expected Result:**
- Status: `200`
- Returns all categories (NaN handling same as GET /product)

---

## CAT-004 — Create Category: successful creation (admin)

**Priority:** Critical

**Preconditions:** Admin logged in; Cloudinary configured.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Category for all electronic devices
allowedAttributes[]=brand
allowedAttributes[]=color
allowedAttributes[]=warranty
image=<valid_image_file>
```

**Expected Result:**
- Status: `201`
- Body:
```json
{
  "status": "success",
  "message": "Category created successfully!",
  "data": {
    "category": {
      "_id": "...",
      "name": "Electronics",
      "description": "Category for all electronic devices",
      "allowedAttributes": ["brand", "color", "warranty"],
      "image": { "url": "https://res.cloudinary.com/...", "public_id": "..." },
      "isActive": true,
      "parentCategory": null
    }
  }
}
```

---

## CAT-005 — Create Category: with parentCategory

**Priority:** High

**Preconditions:** Admin logged in; parent category exists.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Smartphones
description=Subcategory for smartphones devices
allowedAttributes[]=brand
allowedAttributes[]=storage
parentCategory=<valid_parent_category_id>
image=<valid_image_file>
```

**Expected Result:**
- Status: `201`
- `parentCategory` populated with parent category data in response

---

## CAT-006 — Create Category: non-admin (access denied)

**Priority:** Critical

**Preconditions:** Regular user or seller logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<user_jwt>
Content-Type: multipart/form-data

name=Test Category
description=Some description here
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

---

## CAT-007 — Create Category: without auth cookie

**Priority:** High

**Request:**
```
POST /api/v1/category/createcategory
Content-Type: multipart/form-data

name=Test Category
description=Some description here
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## CAT-008 — Create Category: no image uploaded [BUG]

**Priority:** Critical

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Test Category
description=Some description here
allowedAttributes[]=brand
```

**Expected Result (bug — current behavior):**
- Status: `500`
- `TypeError: Cannot read properties of undefined (reading 'buffer')` because `req.file` is `undefined` and code directly accesses `req.file.buffer`

**Expected Result (after fix):**
- Status: `400`
- Body: `{ "status": "fail", "message": "Image is required!" }`

---

## CAT-009 — Create Category: name too short (< 5 chars)

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=IT
description=Some description here
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `400`
- Body contains: `"Category name must contain at least 5 characters!"`

---

## CAT-010 — Create Category: name too long (> 50 chars)

**Priority:** Medium

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
description=Some description here
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `400`
- Body contains: `"Category name is too long!"`

---

## CAT-011 — Create Category: description too short (< 10 chars)

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Short
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `400`
- Body contains: `"Category description must contain at least 10 characters!"`

---

## CAT-012 — Create Category: empty allowedAttributes array

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Category for electronic devices
image=<image>
```

**Expected Result:**
- Status: `400`
- Body contains: `"Allowed attributes must contain at least 1 element!"`

---

## CAT-013 — Create Category: invalid parentCategory ID (non-ObjectId)

**Priority:** Medium

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Category for electronic devices
allowedAttributes[]=brand
parentCategory=not-an-objectid
image=<image>
```

**Expected Result:**
- Status: `400`
- Body contains: `"Invalid parent category ID!"`

---

## CAT-014 — Create Category: duplicate name

**Priority:** High

**Preconditions:** Admin logged in. Category with same name already exists (`name` is `unique` in schema).

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Another electronics category
allowedAttributes[]=brand
image=<image>
```

**Expected Result:**
- Status: `4xx` — MongoDB unique constraint violation

---

## CAT-015 — Create Category: unknown extra field

**Priority:** Medium

**Preconditions:** Admin logged in.

**Request:**
```
POST /api/v1/category/createcategory
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Electronics
description=Category for electronic devices
allowedAttributes[]=brand
isActive=false
image=<image>
```

**Expected Result:**
- Status: `400`
- Body: `"Unknown fields are not allowed!"`

---

## CAT-016 — Edit Category: admin updates name and description

**Priority:** Critical

**Preconditions:** Admin logged in; category exists.

**Request:**
```
PATCH /api/v1/category/editcategory/<categoryId>
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Updated Category
description=Updated description for the category
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Category information edited successfully!",
  "data": { "category": { "name": "Updated Category", ... } }
}
```

---

## CAT-017 — Edit Category: replace image (old deleted from Cloudinary)

**Priority:** High

**Preconditions:** Admin logged in; category has existing image.

**Request:**
```
PATCH /api/v1/category/editcategory/<categoryId>
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

image=<new_image_file>
```

**Expected Result:**
- Status: `200`
- Old image deleted from Cloudinary
- New image URL in response

---

## CAT-018 — Edit Category: non-existent categoryId

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
PATCH /api/v1/category/editcategory/000000000000000000000000
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

name=Updated Name
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Category not found!" }`

---

## CAT-019 — Edit Category: non-admin (access denied)

**Priority:** Critical

**Preconditions:** Regular user logged in.

**Request:**
```
PATCH /api/v1/category/editcategory/<categoryId>
Cookie: authToken=<user_jwt>
Content-Type: multipart/form-data

name=Hacked Category
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

---

## CAT-020 — Delete Category: admin deletes category

**Priority:** Critical

**Preconditions:** Admin logged in; category exists.

**Request:**
```
DELETE /api/v1/category/deletecategory/<categoryId>
Cookie: authToken=<admin_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "Category deleted successfully!" }`
- Category removed from DB
- Category image deleted from Cloudinary

---

## CAT-021 — Delete Category: non-existent categoryId [BUG]

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
DELETE /api/v1/category/deletecategory/000000000000000000000000
Cookie: authToken=<admin_jwt>
```

**Expected Result (current buggy behavior):**
- Status: `500`
- `TypeError: Cannot read properties of null (reading 'image')` — controller does `Category.findById(id)` and then accesses `category.image.url` without checking if `category` is null

**Expected Result (after fix):**
- Status: `404`
- Body: `{ "status": "fail", "message": "Category not found!" }`

---

## CAT-022 — Delete Category: non-admin

**Priority:** Critical

**Preconditions:** Regular user logged in.

**Request:**
```
DELETE /api/v1/category/deletecategory/<categoryId>
Cookie: authToken=<user_jwt>
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

---

## CAT-023 — Delete Category: without auth cookie

**Priority:** High

**Request:**
```
DELETE /api/v1/category/deletecategory/<categoryId>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`
