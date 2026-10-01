/**
 * Comprehensive Automated Verification Suite for SecondStyle Redesign
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8080;

const PAGES = [
  'index.html',
  'homepage.html',
  'detailproduk.html',
  'cart.html',
  'checkout.html',
  'thankyou.html',
  'aboutus.html',
  'profile.html',
  'login.html',
  'create_account.html',
  'forgot_password.html',
  'css/style.css',
  'js/store.js',
  'js/3d-scene.js'
];

let failedTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  FAIL: ${message}`);
    failedTests++;
  }
}

// 1. Verify HTTP Status Codes
async function testHttpEndpoints() {
  console.log('\n--- 1. Testing HTTP Server & Endpoints ---');
  for (const page of PAGES) {
    await new Promise((resolve) => {
      http.get(`http://localhost:${PORT}/${page}`, (res) => {
        assert(res.statusCode === 200, `GET /${page} returns status 200 (got ${res.statusCode})`);
        resolve();
      }).on('error', (err) => {
        assert(false, `GET /${page} failed with network error: ${err.message}`);
        resolve();
      });
    });
  }
}

// 2. Anti-Slop Content & Copywriting Audit (R-02: No em dashes in HTML)
function testAntiSlopCompliance() {
  console.log('\n--- 2. Auditing Anti-Slop Rules & Copywriting Standards ---');
  PAGES.filter(p => p.endsWith('.html')).forEach(page => {
    const fullPath = path.join(ROOT_DIR, page);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Rule R-02: ban on em dash '—' in text
    // (Note: title bar or tags should not use em dash)
    const hasEmDash = content.includes('—');
    assert(!hasEmDash, `${page} has ZERO em-dash characters (Rule R-02 compliant)`);

    // Rule: viewport meta tag present
    assert(content.includes('viewport'), `${page} has responsive viewport meta tag`);

    // Rule: Semantic header and main tags
    assert(content.includes('<header') && content.includes('<main') && content.includes('<footer'), `${page} uses semantic HTML5 tags (header, main, footer)`);
  });
}

// 3. Functional Simulation of js/store.js in Isolated Context
function testStoreEngine() {
  console.log('\n--- 3. Testing Central State & Store Engine (js/store.js) ---');
  
  // Mock browser localStorage and window
  const storage = {};
  const mockLocalStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; }
  };

  const listeners = {};
  global.localStorage = mockLocalStorage;
  global.window = {
    dispatchEvent: () => {},
    addEventListener: () => {},
    CustomEvent: class {}
  };
  global.document = {
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} } }),
    body: { appendChild: () => {} }
  };

  // Load store.js
  const storeCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'store.js'), 'utf8');
  eval(storeCode);
  const Store = global.window.SecondStyleStore;

  assert(typeof Store === 'object' && Store !== null, 'SecondStyleStore exports correctly to window');

  // Test Cart: Add item
  Store.clearCart();
  assert(Store.getCart().length === 0, 'Cart is initially empty');

  Store.addToCart({ id: 1, title: 'Heavyweight Zipper Hoodie', price: 262500, originalPrice: 350000, image: 'img/hood.jpg' }, 'L', 1);
  let cart = Store.getCart();
  assert(cart.length === 1 && cart[0].id === 1 && cart[0].size === 'L' && cart[0].quantity === 1, 'Item added to cart with size L and qty 1');

  // Increment same item
  Store.addToCart({ id: 1, title: 'Heavyweight Zipper Hoodie', price: 262500 }, 'L', 1);
  cart = Store.getCart();
  assert(cart[0].quantity === 2, 'Adding identical item increments quantity to 2');

  // Update quantity
  Store.updateQuantity(1, 'L', -1);
  cart = Store.getCart();
  assert(cart[0].quantity === 1, 'Updating quantity delta -1 decrements to 1');

  // Test Totals calculation
  let totals = Store.getCartTotals();
  assert(totals.subtotal === 262500, `Subtotal calculated correctly: Rp 262.500 (got ${totals.subtotal})`);
  assert(totals.shipping === 35000, `Shipping fee applies below threshold: Rp 35.000 (got ${totals.shipping})`);

  // Test Promo Engine "SECOND9" (25% off)
  const promoRes = Store.applyPromo('SECOND9');
  assert(promoRes.success === true, 'Promo code "SECOND9" applied successfully');

  totals = Store.getCartTotals();
  assert(totals.discountPercent === 25, 'Discount percent is 25%');
  const expectedDiscount = 262500 * 0.25;
  assert(totals.discount === expectedDiscount, `Discount value calculated correctly: Rp ${expectedDiscount} (got ${totals.discount})`);

  // Test Free Shipping Threshold (Add another item to exceed Rp 500.000)
  Store.addToCart({ id: 3, title: 'Oversized Utility Jacket', price: 385000 }, 'XL', 1);
  totals = Store.getCartTotals();
  assert(totals.subtotal >= 500000, 'Cart subtotal exceeds threshold');
  assert(totals.shipping === 0, `Free shipping unlocked: Rp 0 shipping fee (got ${totals.shipping})`);

  // Test Order Creation
  const newOrder = Store.createOrder({
    customerName: 'Narendra Bintang',
    customerEmail: 'bintang@secondstyle.com',
    shippingAddress: 'Jl. Gaya Baru No. 12, Jakarta',
    paymentMethod: 'QRIS / E-Wallet',
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total
  });

  assert(newOrder.orderId.startsWith('SEC-'), `Order created with valid ID: ${newOrder.orderId}`);
  assert(Store.getCart().length === 0, 'Cart cleared after order creation');

  const orders = Store.getOrders();
  assert(orders.length >= 1 && orders[0].orderId === newOrder.orderId, 'Order persisted to secondstyle_orders');
}

// Run All Verification Steps
async function runAll() {
  console.log('====================================================');
  console.log('SecondStyle Comprehensive Verification Suite');
  console.log('====================================================');

  try {
    await testHttpEndpoints();
  } catch (e) {
    console.error('HTTP test error:', e);
  }

  testAntiSlopCompliance();
  testStoreEngine();

  console.log('\n====================================================');
  console.log(`Results: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAll();
