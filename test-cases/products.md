# Products Test Cases

Base path: `/api/v1/product`

**Auth required for write operations:** Yes (`protect` + `allowedTo("seller", "admin")`)
**File upload:** Multipart form-data, field name `images`, max 5 files

---

## PROD-001 — Get Products: successful paginated list

**Priority:** Critical

**Preconditions:** At least one product exists in DB.

**Request:**
```
GET /api/v1/product?page=1&limit=10
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Products returned successfully!",
  "productCount": 42,
  "data": {
    "products": [
      {
        "_id": "...",
        "universal": {
          "title": "...",
          "description": "...",
          "price": 29.99,
          "stock": 5,
          "images": [...],
          "category": { "_id": "...", "name": "..." },
          "sellerId": { "_id": "...", "fullname": "..." },
          "comments": [...],
          "reviews": [...]
        },
        "attributes": { ... }
      }
    ]
  }
}
```
- `category`, `sellerId`, `comments`, `reviews` are populated
- Results sorted by `createdAt` descending

---

## PROD-002 — Get Products: no query params

**Priority:** Medium

**Preconditions:** None.

**Request:**
```
GET /api/v1/product
```

**Expected Result:**
- Status: `200`
- Returns all products (skip = NaN → 0, limit = undefined → all)
- No crash

---

## PROD-003 — Get Products: public endpoint (no auth)

**Priority:** High

**Preconditions:** None.

**Request:**
```
GET /api/v1/product?page=1&limit=5
```

**Expected Result:**
- Status: `200`
- Returns products without auth cookie

---

## PROD-004 — Create Product: successful creation (seller)

**Priority:** Critical

**Preconditions:** Seller logged in; valid `categoryId` exists; category `isActive: true`.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=My Awesome Product
description=This is a detailed product description
price=99.99
stock=10
attributes[color]=red
attributes[size]=XL
images=<image_file_1>
images=<image_file_2>
```

**Expected Result:**
- Status: `201`
- Body:
```json
{
  "status": "success",
  "message": "Product created successfully!",
  "data": {
    "product": {
      "universal": {
        "title": "My Awesome Product",
        "price": 99.99,
        "stock": 10,
        "sellerId": { "_id": "...", "fullname": "..." },
        "category": { "_id": "...", "name": "..." },
        "images": [{ "url": "https://res.cloudinary.com/...", "public_id": "..." }]
      },
      "attributes": { "color": "red", "size": "XL" }
    }
  }
}
```

---

## PROD-005 — Create Product: regular user (access denied)

**Priority:** Critical

**Preconditions:** Regular user (`role: "user"`) logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<user_jwt>
Content-Type: multipart/form-data

title=Test Product
description=Some description here
price=10
stock=1
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "Access denied!" }`

---

## PROD-006 — Create Product: non-existent categoryId

**Priority:** High

**Preconditions:** Seller logged in. Category ID does not exist in DB.

**Request:**
```
POST /api/v1/product/createProduct/000000000000000000000000
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Test Product
description=Some description here
price=10
stock=1
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Category not found!" }`

---

## PROD-007 — Create Product: inactive category

**Priority:** High

**Preconditions:** Seller logged in. Category exists but `isActive: false`.

**Request:**
```
POST /api/v1/product/createProduct/<inactive_categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Test Product
description=Some description here
price=10
stock=1
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "You cant create new product because this category is disabled!" }`

---

## PROD-008 — Create Product: invalid attribute (not in allowedAttributes)

**Priority:** High

**Preconditions:** Seller logged in. Category `allowedAttributes: ["color", "size"]`.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Test Product
description=Some description here
price=10
stock=1
attributes[invalidProp]=someValue
```

**Expected Result:**
- Status: `400`
- Body: `{ "status": "fail", "message": "You passed the wrong properties!" }`

---

## PROD-009 — Create Product: title too short (< 5 chars)

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=abc
description=Some description here
price=10
stock=1
```

**Expected Result:**
- Status: `400`
- Body contains: `"Product title must contain at least 5 characters!"`

---

## PROD-010 — Create Product: title too long (> 100 chars)

**Priority:** Medium

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
description=Some description here test
price=10
stock=1
```

**Expected Result:**
- Status: `400`
- Body contains: `"Product title is too long!"`

---

## PROD-011 — Create Product: description too short (< 10 chars)

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
description=Short
price=10
stock=1
```

**Expected Result:**
- Status: `400`
- Body contains: `"Product description must contain at least 10 characters!"`

---

## PROD-012 — Create Product: price = 0 (not positive)

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
description=Valid description here
price=0
stock=1
```

**Expected Result:**
- Status: `400`
- Body contains: `"Product price must be a positive number!"` or `"Product price must be at least 1!"`

---

## PROD-013 — Create Product: price is a string

**Priority:** Medium

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
description=Valid description here
price=not_a_number
stock=1
```

**Expected Result:**
- Status: `400`
- Zod type error for `price`

---

## PROD-014 — Create Product: more than 5 images uploaded

**Priority:** Medium

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

(6 image files attached to field "images")
```

**Expected Result:**
- Status: `4xx` — multer's `upload.array("images", 5)` rejects more than 5 files

---

## PROD-015 — Create Product: without auth cookie

**Priority:** High

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Content-Type: multipart/form-data

title=Valid Title
description=Valid description here
price=10
stock=1
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## PROD-016 — Create Product: missing required fields

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
```

**Expected Result:**
- Status: `400`
- Validation errors for missing `description`, `price`, `stock`

---

## PROD-017 — Create Product: unknown extra field

**Priority:** Medium

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
description=Valid description here
price=10
stock=1
extraField=surprise
```

**Expected Result:**
- Status: `400`
- Body contains: `"Unknown fields are not allowed!"`

---

## PROD-018 — Edit Product: owner edits own product

**Priority:** Critical

**Preconditions:** Seller logged in; `productId` belongs to logged-in seller.

**Request:**
```
PATCH /api/v1/product/editproduct/<productId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Updated Title
price=149.99
```

**Expected Result:**
- Status: `200`
- Body:
```json
{
  "status": "success",
  "message": "Product edited successfully!",
  "data": { "product": { "universal": { "title": "Updated Title", "price": 149.99, ... } } }
}
```

---

## PROD-019 — Edit Product: seller tries to edit another seller's product

**Priority:** Critical

**Preconditions:** Seller A logged in. `productId` belongs to Seller B.

**Request:**
```
PATCH /api/v1/product/editproduct/<seller_B_productId>
Cookie: authToken=<seller_A_jwt>
Content-Type: multipart/form-data

title=Hacked Title
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You cant edit this product!" }`

---

## PROD-020 — Edit Product: admin can NOT edit another seller's product [design issue]

**Priority:** Medium

**Preconditions:** Admin logged in. Product belongs to a seller.

**Request:**
```
PATCH /api/v1/product/editproduct/<productId>
Cookie: authToken=<admin_jwt>
Content-Type: multipart/form-data

title=Admin Edit
```

**Expected Result:**
- Status: `401` — controller checks only `sellerId`, not admin role
- Note: This may be intentional design

---

## PROD-021 — Edit Product: non-existent productId

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
PATCH /api/v1/product/editproduct/000000000000000000000000
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Updated Title
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Product not found!" }`

---

## PROD-022 — Edit Product: replace images (old deleted from Cloudinary)

**Priority:** High

**Preconditions:** Seller logged in; product has existing images.

**Request:**
```
PATCH /api/v1/product/editproduct/<productId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

images=<new_image_file>
```

**Expected Result:**
- Status: `200`
- Old images deleted from Cloudinary
- New image URL in response

---

## PROD-023 — Delete Product: owner deletes own product

**Priority:** Critical

**Preconditions:** Seller logged in; `productId` belongs to logged-in seller.

**Request:**
```
DELETE /api/v1/product/deleteproduct/<productId>
Cookie: authToken=<seller_jwt>
```

**Expected Result:**
- Status: `200`
- Body: `{ "status": "success", "message": "Product deleted successfully!" }`
- Product removed from DB
- All images deleted from Cloudinary

---

## PROD-024 — Delete Product: admin deletes any product

**Priority:** High

**Preconditions:** Admin logged in.

**Request:**
```
DELETE /api/v1/product/deleteproduct/<any_productId>
Cookie: authToken=<admin_jwt>
```

**Expected Result:**
- Status: `200`
- Admin can delete products from any seller

---

## PROD-025 — Delete Product: seller tries to delete another seller's product

**Priority:** Critical

**Preconditions:** Seller A logged in. `productId` belongs to Seller B.

**Request:**
```
DELETE /api/v1/product/deleteproduct/<seller_B_productId>
Cookie: authToken=<seller_A_jwt>
```

**Expected Result:**
- Status: `401`
- Body: `{ "status": "fail", "message": "You cant delete this product!" }`

---

## PROD-026 — Delete Product: non-existent productId

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
DELETE /api/v1/product/deleteproduct/000000000000000000000000
Cookie: authToken=<seller_jwt>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Product not found!" }`

---

## PROD-027 — Delete Product: without auth cookie

**Priority:** High

**Request:**
```
DELETE /api/v1/product/deleteproduct/<productId>
```

**Expected Result:**
- Status: `404`
- Body: `{ "status": "fail", "message": "Token not found!" }`

---

## PROD-028 — Create Product: NoSQL injection in title

**Priority:** Critical

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title={"$gt": ""}
description=Valid description here test
price=10
stock=1
```

**Expected Result:**
- Zod rejects non-string or sanitizer neutralizes `$`
- No DB operator injection

---

## PROD-029 — Create Product: XSS payload in description

**Priority:** High

**Preconditions:** Seller logged in.

**Request:**
```
POST /api/v1/product/createProduct/<categoryId>
Cookie: authToken=<seller_jwt>
Content-Type: multipart/form-data

title=Valid Title
description=<img src=x onerror=alert(1)> this is a description
price=10
stock=1
```

**Expected Result:**
- Status: `201` (server stores as-is; API is JSON so no HTML rendering)
- Payload stored as raw string — client must sanitize on display
