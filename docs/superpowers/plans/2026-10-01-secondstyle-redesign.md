# SecondStyle E-Commerce Full Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SecondStyle into an Awwwards-tier, modern luxury preloved e-commerce platform with fully working features, refined non-bold typography, interactive 3D Three.js canvas, editorial video showcase, persistent cart and checkout flows, and zero AI slop.

**Architecture:** Multi-Page Vanilla Web Architecture with modern CSS Design System (`css/style.css`), centralized reactive store (`js/store.js`) leveraging `localStorage` for cross-page sync, Three.js 3D visualizer (`js/3d-scene.js`), and consistent Doppelrand nested card aesthetics across all 11 pages.

**Tech Stack:** HTML5 Semantic Markup, Modern CSS3 with Custom Properties and Fluid Typography, Vanilla ES6+ JavaScript, Three.js (via CDN for interactive 3D canvas), Google Fonts (`Plus Jakarta Sans`, `Syne`, `Cinzel`).

**Spec:** [docs/superpowers/specs/2026-10-01-secondstyle-redesign-design.md](file:///c:/e-commerce-basic/docs/superpowers/specs/2026-10-01-secondstyle-redesign-design.md)

## Global Constraints

- No em dash characters (`—`) in any user-facing text, following rule R-02.
- No chunky bold typography; use restrained font-weights 300 (light) and 400 (regular) for an editorial luxury look.
- Zero non-functional interactive elements; every button, input, toggle, modal, and link must work or be removed (R-26).
- Minimum tap target of 44x44px for all interactive mobile elements (R-03).
- Every theme and responsive view must maintain WCAG AA contrast (minimum 4.5:1 for normal text).
- Three UI states required for data views: Empty state, Loading state, and Error state (R-27).
- No file or CSS patching via string-replacement scripts (R-33).

## Review Focus

1. Cart state out of sync when switching pages or tabs: Verify `store.js` broadcasts storage events or re-reads `localStorage` on page load.
2. FakeStoreAPI fails or is blocked: Verify `homepage.html` falls back seamlessly to local curated products without breaking the page or showing an empty blank section.
3. Mobile viewport horizontal overflow on 375px: Verify no elements exceed `100vw` or cause horizontal scrollbars.
4. Promo code "SECOND9" applied multiple times or invalid: Verify only 25% discount is calculated once and invalid codes show polite error toasts.
5. Checkout submission without items: Verify placing an order with an empty cart is blocked with an alert or toast.

---

### Task 1: Core Design System & CSS Infrastructure

**Files:**
- Create: `css/style.css`
- Test: Verify styles load correctly and custom properties are applied across browsers

**Interfaces:**
- Produces: CSS utility tokens (`--bg-primary`, `--text-primary`, `--accent-gold`, `--border-subtle`, `--radius-outer`, `--radius-inner`, `--bezier-spring`), Doppelrand card classes (`.bezel-card`, `.bezel-card-inner`), button-in-button classes (`.btn-luxury`), floating navbar classes (`.floating-nav`), toast notifications (`.toast-container`, `.toast-pill`).

- [ ] **Step 1: Create `css/style.css` with tokens, reset, and base typography**
  Define Google Fonts imports (`Plus Jakarta Sans`, `Syne`, `Cinzel`), color tokens, reset styles, light typography rules, and custom scrollbar.

- [ ] **Step 2: Add Doppelrand (double-bezel) card system and button-in-button styles**
  Implement `.bezel-card` (outer shell) and `.bezel-card-inner` (inner core) with concentric radii and soft ambient shadows. Implement `.btn-luxury` with trailing circle icon and diagonal kinetic hover.

- [ ] **Step 3: Add responsive utilities, marquee ticker, and toast styles**
  Implement `.marquee-track` animation, `.floating-nav` glassmorphism styles, and toast notification slide-in keyframes using `cubic-bezier(0.16, 1, 0.3, 1)`.

- [ ] **Step 4: Commit CSS design system**
  ```bash
  git add css/style.css
  git commit -m "feat(css): build modern editorial design system and component tokens"
  ```

---

### Task 2: Central State & Store Engine (`js/store.js`)

**Files:**
- Create: `js/store.js`
- Test: Test state functions in browser console (cart additions, coupon calculation, orders persistence, toast alerts)

**Interfaces:**
- Produces:
  - `window.SecondStyleStore = { getCart, addToCart, updateQuantity, removeFromCart, getCartTotals, applyPromo, removePromo, getPromo, createOrder, getOrders, getCurrentUser, showToast, formatCurrency }`

- [ ] **Step 1: Write `js/store.js` state management functions**
  Implement `getCart()`, `saveCart(cart)`, `addToCart(product, size, qty)`, `updateQuantity(id, size, delta)`, `removeFromCart(id, size)`, `getCartTotals()`, and `applyPromo(code)`.

- [ ] **Step 2: Add Order and User persistence methods**
  Implement `createOrder(orderData)`, `getOrders()`, `getCurrentUser()`, and initial seed data for demo.

- [ ] **Step 3: Add floating Toast notification engine**
  Create a singleton `.toast-container` in DOM and `showToast(title, message, type)` with auto-dismiss after 3.5 seconds.

- [ ] **Step 4: Add automatic Cart Badge update listener**
  Listen for `DOMContentLoaded` and `storage` events to update all `#cart-count` elements across the page.

- [ ] **Step 5: Commit store engine**
  ```bash
  git add js/store.js
  git commit -m "feat(js): implement central reactive store and toast notification system"
  ```

---

### Task 3: Interactive 3D Canvas & Media Engine (`js/3d-scene.js`)

**Files:**
- Create: `js/3d-scene.js`
- Test: Test Three.js canvas in `index.html` and `detailproduk.html` with mouse orbit and resize handling

**Interfaces:**
- Produces:
  - `window.initHero3D(canvasId)`: Initializes Three.js interactive rotating 3D garment/mesh with soft particle atmosphere and orbit response.
  - `window.initProduct3D(canvasId)`: Initializes 360-degree interactive product 3D rotation viewer.

- [ ] **Step 1: Build `initHero3D` with Three.js scene, camera, and lighting**
  Setup WebGLRenderer with alpha transparency, directional soft warm studio lights, and ambient lighting.

- [ ] **Step 2: Create procedural luxury geometric fabric/hoodie mesh**
  Construct a sculptured 3D mesh with subtle silk/matte dark charcoal material reflecting studio lights.

- [ ] **Step 3: Add smooth mouse parallax and touch interaction**
  Implement smooth damping orbit controls so the 3D model follows pointer movement with inertia.

- [ ] **Step 4: Build `initProduct3D` for 360-degree product detail inspection**
  Add interactive click-and-drag rotation for detail page 3D viewer toggle.

- [ ] **Step 5: Commit 3D scene engine**
  ```bash
  git add js/3d-scene.js
  git commit -m "feat(3d): add Three.js interactive canvas visualizer and orbit controls"
  ```

---

### Task 4: Complete Redesign of Landing Page (`index.html`)

**Files:**
- Modify: `index.html`
- Test: Test in browser: floating nav, 3D canvas, video banner, 3D tilt cards, lookbook, footer

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`, `js/3d-scene.js`
- Produces: Complete landing page experience

- [ ] **Step 1: Rebuild header with floating glass pill navbar**
  Logo wordmark "SecondStyle", nav links (Home, Shop, About, Story), Search button, Profile button, and Cart pill with live count.

- [ ] **Step 2: Build Hero section with Dual 3D Canvas & Editorial Typography**
  Left: Light-weight Syne/Plus Jakarta Sans heading, narrative intro, primary CTA "EXPLORE ARCHIVE", and secondary "WATCH LOOKBOOK". Right: Interactive 3D canvas container with fallback video.

- [ ] **Step 3: Build kinetic marquee ticker**
  Infinite smooth scrolling ticker with promo code "SECOND9", sustainable fashion messaging, and preloved certification.

- [ ] **Step 4: Build "Why SecondStyle" editorial value pillars**
  3 Doppelrand cards with custom ultra-thin line SVGs: Verified Provenance, Circular Luxury, Tailored Curation.

- [ ] **Step 5: Build Curated Drops section with 3D tilt cards**
  4 signature items with hover tilt, price comparison, discount badge, size options, and direct "Add to Cart" with toast feedback.

- [ ] **Step 6: Build Editorial Lookbook & Sustainability Counter**
  Interactive lookbook cards and verified environmental impact statistics.

- [ ] **Step 7: Build Modern Footer**
  Newsletter subscription form with validation, social links, site navigation, and copyright.

- [ ] **Step 8: Commit `index.html`**
  ```bash
  git add index.html
  git commit -m "feat(ui): complete editorial redesign of index.html with 3D canvas and video"
  ```

---

### Task 5: Complete Redesign of Shop & Catalog (`homepage.html`)

**Files:**
- Modify: `homepage.html`
- Test: Test live search filter, category tabs, price sorting, FakeStoreAPI loading & error fallbacks, quick view modal

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`
- Produces: Dynamic shop catalog with dual data sources

- [ ] **Step 1: Rebuild header and page hero banner**
  Match floating navigation, add editorial catalog header with active item count and breadcrumb.

- [ ] **Step 2: Build interactive filter toolbar**
  Category pills (All, Hoodies, Outerwear, Vintage Tees, Pants), real-time search input, and sort dropdown (Price: Low-High, Price: High-Low, Newest).

- [ ] **Step 3: Implement product loading with shimmer skeletons and API integration**
  Render loading skeletons during fetch; fetch from FakeStoreAPI and merge with local curated preloved collection; provide error fallback if API is unreachable.

- [ ] **Step 4: Implement Quick View Modal**
  Modal with backdrop blur, item photo, description, size selector, and "Add to Cart" button.

- [ ] **Step 5: Implement Empty State**
  Display refined "No pieces found matching your filter" with a "Reset Filters" button when search yields 0 items.

- [ ] **Step 6: Commit `homepage.html`**
  ```bash
  git add homepage.html
  git commit -m "feat(ui): redesign homepage.html with live search, filters, and dual-source catalog"
  ```

---

### Task 6: Complete Redesign of Product Detail (`detailproduk.html`)

**Files:**
- Modify: `detailproduk.html`
- Test: Test photo gallery switcher, 3D viewer toggle, size selection, quantity stepper, Add to Cart, Buy Now flow, accordions

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`, `js/3d-scene.js`
- Produces: Immersive product detail page

- [ ] **Step 1: Rebuild layout with Dual Visualizer**
  Left column: High-res image gallery with interactive thumbnail switcher and "View in 3D" toggle button that mounts the Three.js interactive product viewer.

- [ ] **Step 2: Build Product Specs & Purchasing Controls**
  Right column: Light typography heading, original vs discount price, condition badge, interactive Size buttons (S, M, L, XL), quantity stepper, "Add to Cart" button and "Buy It Now" button.

- [ ] **Step 3: Implement Buy It Now logic**
  Save item directly to `secondstyle_buyNow` in localStorage and immediately redirect to `checkout.html`.

- [ ] **Step 4: Build interactive product accordion**
  Collapsible sections: Description & Heritage, Exact Measurements (Chest, Sleeve, Length), Fabric & Sustainability Care, Shipping & Returns.

- [ ] **Step 5: Build Recommended Drops section**
  Related items carousel with quick links to other products.

- [ ] **Step 6: Commit `detailproduk.html`**
  ```bash
  git add detailproduk.html
  git commit -m "feat(ui): redesign detailproduk.html with 3D viewer toggle and complete buying flow"
  ```

---

### Task 7: Complete Redesign of Shopping Cart (`cart.html`)

**Files:**
- Modify: `cart.html`
- Test: Test item addition/removal, quantity change, Free Shipping meter, promo code "SECOND9", checkout redirect

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`
- Produces: Shopping cart page

- [ ] **Step 1: Build responsive Cart table and card list**
  Render items from `SecondStyleStore.getCart()` with thumbnail, title, size badge, unit price, quantity stepper, item total, and delete button.

- [ ] **Step 2: Implement Free Shipping progress meter**
  Display animated progress bar: "Add $X more to unlock Free Insured Shipping".

- [ ] **Step 3: Implement Promo Code validator**
  Promo code input supporting "SECOND9" with instant 25% discount deduction and celebratory toast feedback.

- [ ] **Step 4: Build Order Summary breakdown and Empty Cart state**
  Subtotal, discount line, estimated shipping, final total, and "Proceed to Checkout" CTA. Render elegant empty state with "Browse Archive" button when cart is empty.

- [ ] **Step 5: Commit `cart.html`**
  ```bash
  git add cart.html
  git commit -m "feat(ui): redesign cart.html with promo engine, free shipping bar, and dynamic totals"
  ```

---

### Task 8: Complete Redesign of Checkout & Order Confirmation (`checkout.html`, `thankyou.html`, `checkout_page.html`)

**Files:**
- Modify: `checkout.html`
- Modify: `thankyou.html`
- Delete: `checkout_page.html` (empty unused duplicate)
- Test: Test form validation, visual payment selector (Bank, QRIS, Credit Card preview), order creation, thank you invoice

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`
- Produces: Checkout and order completion workflow

- [ ] **Step 1: Build 2-column checkout layout in `checkout.html`**
  Left: Contact & Shipping form (Name, Email, Phone, Address, City, Postal Code). Right: Sticky Order Summary (item list, subtotal, discount, shipping, total).

- [ ] **Step 2: Build interactive Payment Method selector**
  Options: Bank Transfer (with Virtual Account details), QRIS / E-Wallet (with simulated QR code), Credit Card (with interactive card preview updating cardholder name & number in real time).

- [ ] **Step 3: Implement Order Submission & Storage**
  On form submit, validate inputs, call `SecondStyleStore.createOrder()`, store in `secondstyle_orders`, clear cart, and redirect to `thankyou.html?orderId=...`.

- [ ] **Step 4: Rebuild `thankyou.html` with animated success badge and invoice**
  Display animated checkmark, generated Order ID, estimated delivery timeline, summary table of ordered goods, "Print / Save Receipt" button, and "Back to Store" link.

- [ ] **Step 5: Remove redundant empty file `checkout_page.html`**
  Clean up unused empty file.

- [ ] **Step 6: Commit checkout and thank you pages**
  ```bash
  git rm checkout_page.html
  git add checkout.html thankyou.html
  git commit -m "feat(ui): redesign checkout.html and thankyou.html with interactive payment and receipts"
  ```

---

### Task 9: Complete Redesign of Brand Story & User Profile (`aboutus.html`, `profile.html`)

**Files:**
- Modify: `aboutus.html`
- Modify: `profile.html`
- Test: Test brand timeline, video modal, profile order history rendering, address manager

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`
- Produces: Brand story and user dashboard

- [ ] **Step 1: Redesign `aboutus.html` with editorial magazine aesthetic**
  Hero story manifesto, interactive brand timeline (2023-2026), verified sustainability counters (kg fabric diverted, water saved), video campaign modal.

- [ ] **Step 2: Redesign `profile.html` user dashboard**
  Profile header with user avatar and VIP badge, tabs for "Order History", "Saved Addresses", and "Settings".

- [ ] **Step 3: Connect real Order History from `SecondStyleStore.getOrders()`**
  Dynamically render orders placed via checkout: Order ID, date, status badge ("Confirmed", "In Transit"), items list, total. Include empty state if no orders placed yet.

- [ ] **Step 4: Implement Address Manager and Log Out simulation**
  Modal to add/edit address; sign out confirmation that updates user state.

- [ ] **Step 5: Commit `aboutus.html` and `profile.html`**
  ```bash
  git add aboutus.html profile.html
  git commit -m "feat(ui): redesign aboutus.html and profile.html with live order history dashboard"
  ```

---

### Task 10: Complete Redesign of Authentication Pages (`login.html`, `create_account.html`, `forgot_password.html`)

**Files:**
- Modify: `login.html`
- Modify: `create_account.html`
- Modify: `forgot_password.html`
- Test: Test password visibility toggle, client validation, auth redirect

**Interfaces:**
- Consumes: `css/style.css`, `js/store.js`
- Produces: Luxury authentication suite

- [ ] **Step 1: Redesign `login.html`**
  Luxury glassmorphism card, light typography, email & password inputs with peek password eye toggle, "Remember me" checkbox, sign in submit with feedback, links to register and forgot password.

- [ ] **Step 2: Redesign `create_account.html`**
  Matching luxury card, first name, last name, email, password with strength indicator, terms checkbox, and register submit.

- [ ] **Step 3: Redesign `forgot_password.html`**
  Email reset form with success feedback state and back to sign in link.

- [ ] **Step 4: Commit authentication pages**
  ```bash
  git add login.html create_account.html forgot_password.html
  git commit -m "feat(ui): redesign login, register, and forgot password pages with luxury styling"
  ```

---

### Task 11: End-to-End Verification & Click-Through Testing

**Files:**
- Test all 11 pages in browser
- Verify mobile breakpoints (375px, 768px, 1280px)
- Audit console logs for zero errors

- [ ] **Step 1: Launch local server and open browser subagent**
  Start `npx serve -l 3000` or Python HTTP server, verify all pages load with 200 OK.

- [ ] **Step 2: Execute full click-through verification test**
  1. `index.html`: Check 3D canvas orbit, marquee, add to cart from drop cards.
  2. `homepage.html`: Search for "hoodie", filter by category, sort by price, open quick view modal.
  3. `detailproduk.html`: Switch thumbnails, toggle 3D viewer, select size "M", click "Add to Cart", verify toast appears.
  4. `cart.html`: Adjust quantity, apply promo code "SECOND9", verify 25% discount, click "Proceed to Checkout".
  5. `checkout.html`: Fill shipping details, select Payment Method, place order.
  6. `thankyou.html`: Verify order ID and invoice details.
  7. `profile.html`: Check that newly placed order appears in Order History.
  8. `aboutus.html`: Check story layout, sustainability counters, video modal.
  9. `login.html`, `create_account.html`, `forgot_password.html`: Check input states and links.

- [ ] **Step 3: Audit console logs and responsive layouts**
  Verify 0 console errors and clean mobile layout without horizontal overflow.

- [ ] **Step 4: Final Git Commit and Summary**
  ```bash
  git add -A
  git commit -m "chore: complete SecondStyle total redesign with end-to-end verification"
  ```
