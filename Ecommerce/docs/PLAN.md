# Full Avatar System Refactoring Plan (v2)

## 1. Goal
Implement a robust, secure, and performant end-to-end full avatar system to manage user profile pictures without full page reloads.

## 2. Identified Backend Tasks (`backend-specialist` & `security-auditor`)
1. **File Upload API (`UserController` or `FileController`)**:
   - Create `POST /api/v1/user/{id}/avatar`.
   - **Validation**: Strict validation allowing ONLY `image/jpeg` or `image/png`. Max file size 2MB enforced. Reject anything else to prevent malicious uploads.
   - **Storage Strategy**: Rename uploaded files to a secure dynamic name (e.g., `user_{id}.jpg` or `UUID.png`) to prevent directory traversal or file-overwrite exploits.
   - **Database**: Save ONLY the relative string (e.g., `avatars/user_{id}.jpg`) to the `picture` column.
   - **Response**: The API will explicitly construct and return the fully qualified absolute URL (`http://domain/uploads/avatars/user_{id}.jpg`) for instantaneous React ingestion.
   - Decorate logic with Spring `@Transactional`.

2. **Secure Static Serving via Spring `WebMvcConfigurer`**:
   - Configure a resource handler routing `file:./uploads/` directly to `http://localhost:8080/uploads/**`.
   - **Security Restriction**: Ensure directory listing is disabled natively by Spring and strictly allow ONLY `GET` requests to `/uploads/**`.

## 3. Identified Frontend Tasks (`frontend-specialist`)
1. **Interactive Avatar React Component**:
   - Refactor `UserInfor.js` and header bars to feature an active dynamic avatar URL component relying strictly on the API's full URL format.
   - **Upload Control**: Integrate an elegant `<input type="file" accept="image/png, image/jpeg" />` that blocks non-images directly on the client layer.
2. **State Management & UI Dynamics**:
   - Avoid `window.location.reload()`. Push the newly returned `avatarUrl` from the 200 OK directly into the active React `user` state context.
   - Add cache-busting suffixes (`?t=timestamp`) dynamically to force browsers to aggressively clear cached images and fetch the immediate replacement.
   - Catch `<img onError={e => e.target.src = FallbackAvatar} />` to perpetually guarantee a visual fallback if the server image is invalid or missing.

## 4. Agent Orchestration Breakdown
Following the `@[/orchestrate]` workflow, upon approval, these agents will act together in parallel:
- `backend-specialist` ➞ Core Spring Boot File IO, Controllers, `@Transactional` boundaries, and DTO handling.
- `security-auditor` ➞ Static resource lockdown (GET only), file-extension whitelist blocking, size limits, and filename sanitization.
- `frontend-specialist` ➞ React UX: Cache-busting, local state overriding, and `onError` image fallback mounting.
