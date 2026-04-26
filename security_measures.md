# Security Measures Log

This document tracks the security vulnerabilities identified in the Menova-SaaS application and the measures implemented to resolve them.

---

### 1. Trusting Disguised Files (Fake Images)
*   **Vulnerability**: The application previously trusted the user's claim that an uploaded file was an image, allowing hackers to disguise malicious scripts as pictures.
*   **Resolution**: Implemented a multi-layered validation system in `backend/app/api/v1/uploads.py`.
    *   **Magic Byte Verification**: Uses the `Pillow` library to check the actual file structure.
    *   **Integrity Check**: Runs `img.verify()` to ensure the file is a valid image.
    *   **Image Re-rendering**: The app now re-saves the image data into a new buffer, which strips away all metadata (EXIF) and hidden scripts, ensuring only raw pixel data is stored.

### 2. Messing with Other Restaurants' Data
*   **Vulnerability**: A restaurant owner could trick the app into adding items to a category belonging to a different restaurant, leading to data corruption and unauthorized access.
*   **Resolution**: Implemented strict ownership cross-referencing in `backend/app/api/v1/menu.py`.
    *   Every request to add or update an item now verifies that the `categoryId` provided actually belongs to the `restaurantId` associated with the logged-in user.

### 3. Weak Filters for Bad Text (XSS Prevention)
*   **Vulnerability**: Simple character replacement filters were used to clean text boxes, which could be easily bypassed by hackers to inject harmful JavaScript (Cross-Site Scripting).
*   **Resolution**: Replaced custom filters with the industry-standard **`bleach`** library in `backend/app/core/security.py`.
    *   All user input (menu descriptions, names, etc.) is now processed by a robust HTML parser that strips out all tags and dangerous attributes, ensuring only safe plain text is saved to the database.

### 4. Breaking the App with Bad Links
*   **Vulnerability**: Entering a random or malformed ID in a URL would cause the backend to crash (500 Internal Server Error) instead of failing gracefully, potentially allowing for Denial of Service (DoS) attacks.
*   **Resolution**: Implemented a global **`to_object_id`** safety guard in `backend/app/api/v1/deps.py`.
    *   All ID strings provided in URLs are now validated before processing. If an ID is malformed, the app now returns a polite **404 Not Found** response instead of crashing the request.

### 5. Accepting the Wrong ID Cards (JWT Validation)
*   **Vulnerability**: The application was verifying if a login token was real, but not checking if it was specifically issued for *this* app (missing Audience check).
*   **Resolution**: Hardened the JWT verification logic in `backend/app/api/v1/deps.py`.
    *   Enabled **`verify_aud: True`** and explicitly set the expected **`audience`** to match the specific Clerk project instance (`https://sweet-slug-0.clerk.accounts.dev`).
    *   This ensures that tokens from other applications—even if they use the same provider—are rejected.
