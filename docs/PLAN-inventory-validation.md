# PLAN: Inventory Validation System

## Overview

The NHS e-commerce platform currently deducts stock only at order creation — but has **no pre-checkout validation**, **no cart-level stock warnings**, and **no concurrency protection** against two users buying the last unit simultaneously.

This plan adds a layered inventory validation system based on agreed decisions:
- **Q1:** Validate stock at checkout only (no reservation)
- **Q2:** Validate at checkout + optional warning badge in cart
- **Q3:** Pessimistic lock inside `deductStockForOrder()` to eliminate race conditions

---

## Project Type

**BACKEND + WEB** (Full-stack feature across Spring Boot API & React frontend)

| Layer | Agent |
|---|---|
| Domain / Exception | `backend-specialist` |
| Backend Service & API | `backend-specialist` |
| Frontend UI | `frontend-specialist` |
| Testing | `test-engineer` |

---

## Success Criteria

| # | Criterion | How to Verify |
|---|---|---|
| 1 | Checkout with qty > available stock → rejected with `409 CONFLICT` | POST `/api/v1/order` with oversell payload |
| 2 | Two simultaneous checkouts for the last unit → exactly one succeeds | Concurrent test with 2 threads |
| 3 | Cart page shows out-of-stock badge on unavailable items | Load cart with a product_item at qty=0 |
| 4 | Checkout page shows item-level stock errors before order button | Trigger validation with bad qty |
| 5 | `IllegalArgumentException` no longer used for stock errors (uses typed exception) | Code review |
| 6 | All existing tests still pass | `mvn test` |

---

## Current State (Gap Analysis)

| Area | Current Behaviour | Gap |
|---|---|---|
| `CartItemService.save()` | Adds any qty to cart | No stock check at add |
| `CartItemService.update()` | Updates qty freely | No stock check at update |
| `ShopOrderService.deductStockForOrder()` | Checks total available, deducts | No pessimistic lock — race condition possible |
| `ShopOrderService.createOrder()` | Throws `IllegalArgumentException` for stock errors | Not typed — can't be caught specifically |
| `GET /api/v1/cart` | Returns cart items | No stock availability field on response |
| Frontend checkout | No pre-flight validation | Errors only come back after full backend rejection |
| Frontend cart | No stock warning | User doesn't know item is unavailable until checkout |

---

## Tech Stack

| Component | Technology | Rationale |
|---|---|---|
| Backend | Spring Boot 3 + Jakarta Validation | Already in use |
| Pessimistic Lock | JPA `@Lock(LockModeType.PESSIMISTIC_WRITE)` | Atomic check+deduct without reservation tables |
| Stock Exception | New `InsufficientStockException` | Typed exception — consistent 409 response |
| Stock DTOs | New `StockAvailabilityDto` + `StockCheckRequest` records | Clean response shape for new endpoint |
| Frontend Warning | React `useState` + `useEffect` with API call | Lightweight; no new library |
| Checkout Validation | Pre-submit call to `POST /api/v1/stock/check` | Bulk validation before order POST |

---

## File Structure (New + Modified Files)

```
Ecommerce/nhs-api/src/main/java/com/nhs/individual/
├── exception/
│   └── InsufficientStockException.java          [NEW]
├── dto/
│   └── StockAvailabilityDto.java                [NEW]
│   └── StockCheckRequest.java                   [NEW]
├── controller/
│   └── StockController.java                     [NEW]  <- POST /api/v1/stock/check
│   └── CartController.java                      [MODIFY]
├── service/
│   └── StockValidationService.java              [NEW]
│   └── ShopOrderService.java                    [MODIFY] <- add pessimistic lock
├── repository/
│   └── WarehouseItemRepository.java             [MODIFY] <- add @Lock query
└── exception/handler/
    └── APIExceptionHandler.java                 [MODIFY] <- InsufficientStockException -> 409

ecommerce-ui/src/
├── api/
│   └── stock.js                                 [NEW]
├── components/stock-badge/
│   └── StockBadge.jsx                           [NEW]
├── part/user-cart/cart/
│   └── UserCart.js                              [MODIFY]
└── page/user/user-order-checkout-page/
    └── UserOrderCheckoutPage.js                 [MODIFY]
```

---

## Task Breakdown

### Phase 1 — Backend Foundation (P0)

---

#### TASK-01 · Exception + DTOs
**Agent:** `backend-specialist` | **Priority:** P0 — blocker for all backend tasks

**INPUT:** Nothing (new files)

**OUTPUT:**
- `InsufficientStockException.java` — typed RuntimeException with fields: `productItemId`, `requested`, `available`
- `StockAvailabilityDto.java` — record: `productItemId`, `availableQty`, `isAvailable`, `message`
- `StockCheckRequest.java` — record: `productItemId`, `requestedQty`

**VERIFY:**
- Classes compile without error
- `StockAvailabilityDto` serializes to JSON via `ObjectMapper`

---

#### TASK-02 · `StockValidationService`
**Agent:** `backend-specialist` | **Priority:** P0
**Depends on:** TASK-01

**INPUT:**
- `WarehouseItemRepository.sumQuantityByProductItemId()` — already exists
- List of `StockCheckRequest` items from controller or service callers

**OUTPUT:**
Two methods:
- `checkBulk(List<StockCheckRequest>)` → `List<StockAvailabilityDto>` (read-only, no throws)
- `assertSufficientStock(List<StockCheckRequest>)` → throws `InsufficientStockException` on first failure

**VERIFY:**
- Unit test: `checkBulk` with mocked repo qty=3, requested=5 → `isAvailable=false`
- Unit test: `assertSufficientStock` with sufficient stock → no exception
- Unit test: `assertSufficientStock` with insufficient → throws `InsufficientStockException`

---

#### TASK-03 · `StockController` — `POST /api/v1/stock/check`
**Agent:** `backend-specialist` | **Priority:** P1
**Depends on:** TASK-02

**INPUT:** `StockValidationService.checkBulk()`

**OUTPUT:**
```
POST /api/v1/stock/check
Body: [{ "productItemId": 1, "requestedQty": 2 }]

Response 200:
[{ "productItemId": 1, "availableQty": 5, "isAvailable": true, "message": null }]
```
- Authenticated only
- Read-only — no deduction, no reservation

**VERIFY:**
- Postman test: correct response shape with 200
- Unauthenticated request → 401

---

#### TASK-04 · Pessimistic Lock in `deductStockForOrder()`
**Agent:** `backend-specialist` | **Priority:** P0
**Depends on:** TASK-01

**INPUT:** `ShopOrderService.deductStockForOrder()` — no lock, sequential read-modify-write

**OUTPUT:**
- New locked query in `WarehouseItemRepository`:
  `findAvailableStockForUpdate(@Param productItemId)` with `@Lock(PESSIMISTIC_WRITE)`
- Replace `findAvailableStockByProductItemId` with `findAvailableStockForUpdate` inside the `@Transactional` boundary
- Replace `throw new IllegalArgumentException(...)` for stock errors → `throw new InsufficientStockException(...)`

> IMPORTANT: The `@Transactional` on `createOrder()` must be `REQUIRED` propagation (default). The `PESSIMISTIC_WRITE` lock only works inside an active transaction.

**VERIFY:**
- Concurrent test: 2 threads buy last 1 unit → exactly 1 order created, 1 gets 409
- `createOrder()` annotated `@Transactional` (confirm — already present)

---

#### TASK-05 · `APIExceptionHandler` — Map `InsufficientStockException` to 409
**Agent:** `backend-specialist` | **Priority:** P1
**Depends on:** TASK-01

**INPUT:** `APIExceptionHandler.java` — handles `IllegalArgumentException` → 400

**OUTPUT:**
New `@ExceptionHandler` method:
- `InsufficientStockException` → HTTP 409 CONFLICT
- Response body: `{ message, details: "productItemId=X requested=Y available=Z" }`

**VERIFY:**
- POST `/api/v1/order` with oversell → HTTP 409, body includes `productItemId`
- Existing `IllegalArgumentException` → still HTTP 400 (no regression)

---

### Phase 2 — Frontend (P2 — after backend is live)

---

#### TASK-06 · `stock.js` — API Client
**Agent:** `frontend-specialist` | **Priority:** P2
**Depends on:** TASK-03

**INPUT:** `APIBase.js` (existing Axios instance)

**OUTPUT:**
```js
// src/api/stock.js
export const checkStock = async (items) => {
  const res = await APIBase.post('/api/v1/stock/check', items);
  return res.data; // StockAvailabilityDto[]
};
```

**VERIFY:**
- Call in browser dev console returns array with `isAvailable` field

---

#### TASK-07 · `StockBadge.jsx` + Cart Warning in `UserCart.js`
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**Priority:** P2
**Depends on:** TASK-06

**INPUT:**
- `UserCart.js` — renders cart items from `data` state
- Stock availability fetched after cart loads

**OUTPUT:**
- `StockBadge.jsx` — reusable badge component:
  - qty=0 → red "Out of Stock"
  - qty < requestedQty but > 0 → orange "Only N left"
  - otherwise → nothing
- `UserCart.js` changes:
  - After cart data loads, call `checkStock(data.map(i => ({ productItemId: i.productItem.id, requestedQty: i.qty })))`
  - Store results in `stockMap` state (keyed by `productItemId`)
  - Render `<StockBadge>` next to each `OrderItem`
  - Disable **Checkout** button if any selected item has `isAvailable: false`

**VERIFY:**
- Cart item with warehouse qty=0 → badge shows "Out of Stock"
- Checkout button disabled when an out-of-stock item is selected
- Stock API failure → badge silently absent (no crash)

---

#### TASK-08 · Pre-submit Stock Gate in `UserOrderCheckoutPage.js`
**Agent:** `frontend-specialist` | **Priority:** P2
**Depends on:** TASK-06

**INPUT:** `UserOrderCheckoutPage.js` `submitHandler()` — currently POSTs to `/api/v1/order` directly

**OUTPUT:**
Modified `submitHandler()` flow:
```
1. globalContext.loader(true)
2. Call checkStock(items)                <- NEW step
3. Filter failed = results where isAvailable=false
4. If failed.length > 0:
     Show message.error per item, abort  <- NEW step
     globalContext.loader(false)
     return
5. ... existing POST /api/v1/order flow (unchanged) ...
```

**VERIFY:**
- Submit with out-of-stock item → error shown, no POST to `/api/v1/order` in Network tab
- Submit with all in-stock → order proceeds normally
- Backend 409 (race condition edge case) still caught by existing `.catch()` handler

---

## Task Dependency Graph

```
TASK-01 (Exception + DTOs)
    ├─► TASK-02 (StockValidationService)
    │       └─► TASK-03 (StockController)
    │                   └─► TASK-06 (stock.js)
    │                           ├─► TASK-07 (Cart badge)
    │                           └─► TASK-08 (Checkout gate)
    └─► TASK-04 (Pessimistic lock)
    └─► TASK-05 (APIExceptionHandler 409)
```

**Tasks that can run in parallel:**
- TASK-04 and TASK-03 → no shared files
- TASK-07 and TASK-08 → no shared files

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pessimistic lock causes DB deadlocks under high concurrency | Low | High | Lock scope is narrow (per productItemId), transaction is short |
| `checkStock` API call slows cart page load | Medium | Low | Fire after cart data loads; badge is optional UX only |
| Frontend pre-validation bypassed by direct API call | Certain | Medium | Backend `deductStockForOrder` is the hard gate — frontend is UX only |
| `@Lock` ignored without active transaction | Low | High | `createOrder()` is already `@Transactional` |

---

## Phase X — Verification Checklist

```
[ ] TASK-01: InsufficientStockException + DTOs compile
[ ] TASK-02: StockValidationService unit tests pass (3 test cases)
[ ] TASK-03: POST /api/v1/stock/check returns correct JSON shape
[ ] TASK-04: Race condition test — exactly 1 order created from 2 concurrent requests
[ ] TASK-05: POST /api/v1/order with oversell -> HTTP 409 (not 400, not 500)
[x] TASK-06: checkStock() returns data in browser
[x] TASK-07: Out-of-stock badge renders; Checkout button disabled
[x] TASK-08: Pre-submit validation aborts; no spurious POST to /order
[ ] REGRESSION: mvn test passes
[ ] REGRESSION: Normal checkout end-to-end still works
```

**Commands:**
```bash
# Backend tests
cd Ecommerce && mvn test

# Frontend lint
cd ecommerce-ui && npm run lint

# Security scan
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
```
