# Firestore Security Specification — SZGH Pakistan Live Inventory & Product Image Manager

## 1. Data Invariants
1. **Path & Document ID Integrity**: Every `productId` in `/inventory/{productId}`, `manifestId` in `/catalog_index/{manifestId}`, and `adminUid` in `/admins/{adminUid}` must match `^[a-zA-Z0-9_\-]+$` with length between 1 and 128 characters.
2. **Zero-Trust Administrator Write Gate**: Only a verified administrator (`request.auth != null && request.auth.token.email_verified == true && (request.auth.token.email in ['khubaib4000@gmail.com', 'grnoman786@gmail.com'] || exists(/databases/$(database)/documents/admins/$(request.auth.uid)))`) can create, update, or delete inventory items or the catalog manifest.
3. **Strict Key & Type Enforcement**: `InventoryItem` writes must contain all 13 required keys (`productId`, `modelNumber`, `title`, `category`, `subcategory`, `description`, `price`, `stockCount`, `stockStatus`, `defaultImageIndex`, `images`, `updatedBy`, `updatedAt`) and no shadow/extra keys (`hasOnly`).
4. **Volumetric & Boundary Constraints**:
   - `modelNumber`: string, `1..120` chars
   - `title`: string, `0..200` chars (left empty if not provided in Excel `stock list` sheet)
   - `category`: enum in `['Controllers', 'Motors', 'Machines', 'Robots']`
   - `subcategory`: string, `0..120` chars (left empty if not provided in Excel `stock list` sheet)
   - `description`: string, `0..1500` chars (left empty if not provided in Excel `stock list` sheet)
   - `price`: integer, `0..1000000000`
   - `stockCount`: integer, `0..100000`
   - `stockStatus`: enum in `['In Stock', 'Low Stock', 'Pre-Order']`
   - `defaultImageIndex`: integer, `0..3`
   - `images`: list of 1 to 4 strings, with first element validated as string `0..220000` chars
   - `updatedBy`: string matching `request.auth.uid`
   - `updatedAt`: timestamp strictly equal to `request.time`
5. **No Unfiltered List Scraping**: Single-document `get` access on `/inventory/{productId}` and `/catalog_index/{manifestId}` is allowed with `isValidId()` so customers see live stock and product photos without exposing blanket `list` queries.
