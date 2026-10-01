# Design Specification: SecondStyle E-Commerce Full Redesign

Date: 2026-10-01
Status: Approved by User
Architecture Type: Multi-Page Application (Vanilla HTML5, Modern CSS Design System, Three.js 3D Canvas, Vanilla ES6+ State Store)

---

## 1. Executive Summary & Brand Identity

SecondStyle is an editorial luxury preloved fashion platform. The goal of this redesign is to elevate the digital storefront from a basic template to an Awwwards-tier, modern agency experience.

### Core Aesthetic Pillars
- **Anti-Slop Craftsmanship**: Zero generic AI aesthetics, no harsh rainbow gradients, no excessive glowing blobs, and no thick pill buttons everywhere.
- **Editorial Typography**: Elegant, light, and regular weights (font weights 300 and 400). Primary typeface: `Plus Jakarta Sans` with editorial display accents `Syne` and `Cinzel`. Bold weights are strictly restrained to prevent heavy, cluttered headings.
- **Color Architecture**:
  - Luxury Obsidian: `#0c0e12` (Deep rich dark tone)
  - Warm Alabaster: `#f8f7f4` (Light luxury background)
  - Pure Alabaster Light Surface: `#ffffff`
  - Subtle Muted Pearl: `#e6e4dc` (Precision hairline borders)
  - Champagne Gold Accent: `#c5a880` (Refined status & highlight accent)
  - Soft Emerald: `#2d6a4f` (Positive feedback & success badge)
- **Kinetic & 3D Immersion**:
  - Interactive Three.js 3D geometric cloth/hoodie model on the Hero section responding to mouse orbit and touch gestures.
  - Ambient editorial fashion video loop banner with pause/play controls.
  - CSS 3D perspective card tilt on hover with dynamic reflection glare.
  - Doppelrand (double-bezel) card architecture for high-end haptic depth.

---

## 2. Global Architecture & File Structure

The project will maintain and completely redesign all existing pages while introducing a centralized design system and shared reactive state engine:

```
c:/e-commerce-basic/
├── css/
│   └── style.css            # Central Modern CSS Design System & Utility Engine
├── js/
│   ├── store.js             # Global Store: Cart, Auth, Orders, Promo Codes, Toast Engine
│   ├── 3d-scene.js          # Three.js Interactive 3D Canvas Visualizer
│   └── main.js              # Page-level UI Interactions & Micro-animations
├── index.html               # Luxury Landing Page (3D Hero, Video Banner, Lookbook, Drops)
├── homepage.html            # Shop Catalog (Live Search, Category Tabs, Dual Data Source)
├── detailproduk.html        # Product Detail (Photo Gallery, 3D Interactive Toggle, Accordion)
├── cart.html                # Interactive Shopping Cart (Coupon SECOND9, Free Shipping Bar)
├── checkout.html            # Multi-step Checkout & Visual Payment Selector
├── thankyou.html            # Animated Order Confirmation & Invoice Summary
├── aboutus.html             # Editorial Brand Story, Timeline & Sustainability Metrics
├── profile.html             # User Dashboard with Live Order History & Saved Addresses
├── login.html               # Luxury Minimalist Sign In Card
├── create_account.html      # Create Account with Client Validation
└── forgot_password.html     # Password Reset Flow with Confirmation
```

---

## 3. Design System & Component Specifications

### 3.1 Typography
- Headings: `Syne` / `Cinzel` / `Plus Jakarta Sans`, font-weight 300 to 400, letter-spacing 0.05em to 0.15em.
- Body: `Plus Jakarta Sans`, font-weight 300 to 400, line-height 1.6, color `#2a2e35` for light mode, `#e0e0e0` for dark accents.
- Small Captions / Badges: font-weight 400, uppercase, letter-spacing 0.18em.

### 3.2 Double-Bezel (Doppelrand) Architecture
All product cards, modal containers, and feature showcases follow the nested bezel pattern:
- **Outer Frame**: Background `rgba(0, 0, 0, 0.03)` with hairline border `1px solid rgba(0, 0, 0, 0.08)` and padding `6px`, border-radius `24px`.
- **Inner Core**: Clean surface background `#ffffff`, subtle inner highlight shadow, border-radius `18px`, and smooth transition physics.

### 3.3 Button & CTA Architecture
- Primary CTA: Pill shape with inner margin, button-in-button trailing icon wrapper with diagonal micro-translation on hover.
- Transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1)`.
- Active state: `transform: scale(0.98)` for tactile spring feedback.

---

## 4. Central Store Engine (`store.js`)

A lightweight, robust Vanilla ES6 state manager that syncs across tabs and pages via `localStorage`:

### 4.1 State Schema
- `secondstyle_cart`: Array of items `[{ id, title, price, originalPrice, image, size, quantity }]`.
- `secondstyle_promo`: `{ code: 'SECOND9', discount: 0.25, applied: false }`.
- `secondstyle_user`: `{ name: 'Narendra Bintang Ramadan', email: 'bintang@secondstyle.com', addresses: [...], isLoggedIn: true }`.
- `secondstyle_orders`: Array of placed orders `[{ orderId, date, items, subtotal, discount, total, status, shippingAddress, paymentMethod }]`.

### 4.2 Core Store Methods
- `getCart()` / `saveCart(cart)`: Loads and persists cart.
- `addToCart(product, size, quantity)`: Appends or increments item quantity, triggers floating toast.
- `updateQuantity(id, size, delta)`: Increments/decrements quantity, removes if zero.
- `removeFromCart(id, size)`: Deletes item with toast feedback.
- `applyPromo(code)`: Validates "SECOND9" for 25% off discount, updates calculations.
- `getCartTotals()`: Returns `{ subtotal, discount, shipping, total, freeShippingRemaining }`.
- `createOrder(orderDetails)`: Saves completed order to `secondstyle_orders`, clears current cart.
- `showToast(title, message, type)`: Spawns an animated luxury toast notification in the viewport.

---

## 5. Page-by-Page Requirements & Interactions

### 5.1 `index.html` (Landing Page)
1. **Header Navigation**: Detached floating glass pill with brand wordmark, navigation links, search trigger, profile shortcut, and dynamic live cart pill with item count badge.
2. **Hero Section**:
   - Left side: Editorial headline with restrained light typography, narrative copy, and CTA buttons.
   - Right side: Three.js interactive 3D canvas (interactive geometric fabric / hoodie mesh rotating gracefully with orbit mouse controls) and fallback luxury video loop.
3. **Kinetic Marquee**: High-fashion ticker ("25% OFF WITH CODE: SECOND9 : SUSTAINABLE PRELOVED CURATION : VERIFIED AUTHENTICITY").
4. **Why SecondStyle**: 3 editorial cards with bespoke thin-line SVGs (Curated Authenticity, Eco-Conscious Circular Fashion, Rare Vintage Archive).
5. **Curated Drops**: Grid of 4 top preloved items with 3D tilt interaction, size preview, quick "Add to Cart", and discount tags.
6. **Editorial Video Showcase**: High-fashion campaign video container with play/pause and sound toggle.
7. **Lookbook & Sustainability Metrics**: Dynamic counter of kilograms of textile waste diverted.
8. **Footer**: 4-column structured layout with newsletter subscribe form, functional links, and copyright.

### 5.2 `homepage.html` (Shop / Catalog)
1. **Interactive Filter Toolbar**:
   - Category filter pills: All, Hoodies, Outerwear, Vintage Tees, Pants.
   - Live Search Input: Instant real-time filtering as the user types.
   - Price & Sort Selector: Low to High, High to Low, Newest Arrivals.
2. **Product Grid**:
   - Curated local items combined with FakeStoreAPI live products.
   - Loading State: Shimmer skeleton cards during fetch.
   - Empty State: Refined "No pieces found" message with a reset filter button.
   - Error State: Graceful fallback to rich local archive items.
3. **Quick View Modal**: Inspect item details, select size, and add to cart without leaving the catalog.

### 5.3 `detailproduk.html` (Product Detail)
1. **Dual Visualizer**:
   - High-resolution multi-angle image gallery with interactive thumbnail switcher.
   - 3D Interactive View toggle: Switches the main visualizer into an interactive 3D canvas for full rotation inspection.
2. **Product Specs**:
   - Title, brand, price with discount strike-through.
   - Interactive Size Selector (S, M, L, XL) with size indicator.
   - Quantity Stepper (+ and -).
   - "Add to Cart" and "Buy It Now" buttons (Buy It Now populates `buyNowItem` and directly redirects to `checkout.html`).
3. **Product Accordion**:
   - Product Story & Condition Report (A+ Preloved Grade).
   - Detailed Size Measurements (Chest, Length, Sleeve).
   - Fabric, Care & Sustainable Footprint.
   - Shipping & Return Policy.
4. **Recommended Curations**: 4 related products with direct links.

### 5.4 `cart.html` (Shopping Cart)
1. **Cart Table & Cards**: List of cart items with image thumbnail, title, selected size, price, reactive quantity stepper, item total, and delete button.
2. **Empty Cart State**: Elegant visual empty screen with "Discover Curated Drops" button leading to `homepage.html`.
3. **Free Shipping Progress Bar**: Interactive bar showing progress toward free insured delivery.
4. **Coupon System**: Input for promo code "SECOND9", displaying 25% discount and recalculating the total.
5. **Checkout Summary**: Subtotal, discount amount, calculated shipping, total amount, and "Proceed to Checkout" CTA.

### 5.5 `checkout.html` (Checkout & Payment)
1. **2-Column Responsive Layout**:
   - Column 1: Customer Contact, Shipping Address (Full name, phone, email, street, city, postal code).
   - Column 2: Live Order Summary (items list, subtotal, discount, total).
2. **Payment Method Selector**:
   - Bank Transfer (BCA, Mandiri, BNI with virtual account guidance).
   - E-Wallet / QRIS (Instant QR code preview).
   - Credit / Debit Card (Interactive visual card mockup showing cardholder name and number as user types).
3. **Validation & Submission**:
   - Complete HTML5 validation for all required fields.
   - Submission creates an order in `secondstyle_orders`, triggers order confirmation toast, clears cart, and redirects to `thankyou.html`.

### 5.6 `thankyou.html` (Order Confirmation)
1. Animated celebratory success badge with confetti particle effect.
2. Order Number generator (e.g. `#SEC-2026-8924`).
3. Summary of purchased items and shipping destination.
4. Print/Download Order Invoice button.
5. "Continue Shopping" button returning to `homepage.html`.

### 5.7 `aboutus.html` (Brand Story & Editorial Manifesto)
1. High-fashion magazine editorial layout.
2. Interactive brand journey timeline (2023 to 2026).
3. Verified sustainability impact counter.
4. Video reel modal with luxury campaign visuals.

### 5.8 `profile.html` (Customer Dashboard)
1. User profile header with avatar and member status.
2. **Order History Tab**: Dynamically renders real orders placed from `checkout.html`, displaying order ID, date, status pill, item thumbnails, and total.
3. **Saved Address Tab**: View and edit shipping destinations.
4. **Sign Out**: Clears login session with confirmation modal.

### 5.9 `login.html`, `create_account.html`, `forgot_password.html`
1. Shared luxury minimalist card architecture with subtle backdrop blur.
2. Password visibility toggle (eye icon).
3. Client-side validation with instant visual feedback.
4. Smooth links connecting all auth states.

---

## 6. Accessibility & Antislop Compliance Matrix

- **WCAG AA Contrast**: Normal text >= 4.5:1 ratio, large headings >= 3.0:1 ratio.
- **Keyboard Navigation**: Full `Tab` order, visible focus rings with `outline-offset`, `Escape` key closes modals and drawers.
- **Touch Targets**: Minimum 44x44px for all interactive buttons and mobile links.
- **Copywriting Cleanliness**: Ban on em dashes throughout all UI copy (Rule R-02).
- **Theme Resilience**: Both light luxury background and dark accents maintain crisp contrast and zero layout shifts.

---

## 7. Verification & Testing Strategy

1. **Functional Verification**:
   - Full purchasing flow tested: Add to Cart -> Adjust Qty -> Apply Promo "SECOND9" -> Checkout Form -> Submit -> Thank You -> Order listed in Profile.
   - Live Search and category filtering tested on `homepage.html`.
   - 3D Canvas initialization and mouse orbit responsiveness verified.
2. **Mobile Responsiveness Verification**:
   - Tested on viewports 375px (mobile), 768px (tablet), and 1280px (desktop).
   - Zero horizontal overflow (`overflow-x: hidden`).
3. **Console Health**:
   - Zero console errors during all user interactions.
