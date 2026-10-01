/**
 * SecondStyle Central Reactive Store Engine
 * Handles Cart, Promo Codes, Order History, User Session, and Floating Toasts
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CART: 'secondstyle_cart',
    PROMO: 'secondstyle_promo',
    ORDERS: 'secondstyle_orders',
    USER: 'secondstyle_user',
    BUY_NOW: 'secondstyle_buynow'
  };

  const FREE_SHIPPING_THRESHOLD = 500000; // IDR 500.000 or $35.00
  const DEFAULT_SHIPPING_FEE = 35000;

  // Initialize initial user if not set
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const defaultUser = {
      name: 'Narendra Bintang Ramadan',
      email: 'bintang@secondstyle.com',
      phone: '+62 812 3456 7890',
      address: 'Jl. Gaya Baru No. 12, Kebayoran Baru',
      city: 'Jakarta Selatan',
      postalCode: '12160',
      isLoggedIn: true
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  }

  // Helper to format currency in IDR (Rp) or USD
  function formatCurrency(amount) {
    if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  // --- Cart Operations ---
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch (e) {
      console.error('Error parsing cart:', e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartBadges();
    window.dispatchEvent(new CustomEvent('secondstyle:cart-updated', { detail: { cart } }));
  }

  function addToCart(product, size = 'M', quantity = 1) {
    if (!product || !product.id) return;
    const cart = getCart();
    quantity = parseInt(quantity, 10) || 1;
    const existingIndex = cart.findIndex(item => item.id == product.id && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title || 'Curated Garment',
        price: parseFloat(product.price) || 250000,
        originalPrice: parseFloat(product.originalPrice) || (parseFloat(product.price) * 1.33) || 332500,
        image: product.image || 'img/hood.jpg',
        size: size,
        quantity: quantity
      });
    }

    saveCart(cart);
    showToast('Piece Added to Cart', `${product.title || 'Item'} (${size}) is in your bag.`, 'success');
  }

  function updateQuantity(id, size, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id == id && i.size === size);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => !(i.id == id && i.size === size));
      showToast('Item Removed', `${item.title} removed from bag.`, 'info');
    }
    saveCart(cart);
  }

  function removeFromCart(id, size) {
    let cart = getCart();
    const item = cart.find(i => i.id == id && i.size === size);
    cart = cart.filter(i => !(i.id == id && i.size === size));
    saveCart(cart);
    if (item) {
      showToast('Item Removed', `${item.title} removed from bag.`, 'info');
    }
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
    updateCartBadges();
    window.dispatchEvent(new CustomEvent('secondstyle:cart-updated', { detail: { cart: [] } }));
  }

  // --- Promo Engine ---
  function getPromo() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMO)) || null;
    } catch (e) {
      return null;
    }
  }

  function applyPromo(code) {
    if (!code) return { success: false, message: 'Please enter a voucher code.' };
    const normalized = code.trim().toUpperCase();

    if (normalized === 'SECOND9') {
      const promoData = {
        code: 'SECOND9',
        discountPercent: 25,
        description: '25% Special Preloved Anniversary Discount'
      };
      localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(promoData));
      showToast('Promo Code Applied', '25% discount successfully unlocked with SECOND9', 'success');
      window.dispatchEvent(new CustomEvent('secondstyle:cart-updated', { detail: { cart: getCart() } }));
      return { success: true, message: 'Promo applied!' };
    }

    showToast('Invalid Code', 'Voucher code not recognized. Try SECOND9', 'error');
    return { success: false, message: 'Invalid voucher code.' };
  }

  function removePromo() {
    localStorage.removeItem(STORAGE_KEYS.PROMO);
    showToast('Promo Removed', 'Voucher code removed.', 'info');
    window.dispatchEvent(new CustomEvent('secondstyle:cart-updated', { detail: { cart: getCart() } }));
  }

  // --- Calculations ---
  function getCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const promo = getPromo();

    let discount = 0;
    if (promo && promo.discountPercent) {
      discount = subtotal * (promo.discountPercent / 100);
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : DEFAULT_SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    return {
      subtotal,
      discount,
      discountPercent: promo ? promo.discountPercent : 0,
      promoCode: promo ? promo.code : null,
      shipping,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      freeShippingProgress,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // --- Order Management ---
  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [
        {
          orderId: 'SEC-2025-4819',
          date: '24 Sep 2025',
          items: [
            { title: 'Heavyweight Boxy Hoodie', size: 'L', quantity: 1, price: 320000, image: 'img/hood.jpg' }
          ],
          subtotal: 320000,
          discount: 80000,
          shipping: 0,
          total: 240000,
          status: 'Delivered',
          shippingAddress: 'Jl. Gaya Baru No. 12, Kebayoran Baru, Jakarta Selatan',
          paymentMethod: 'Bank Transfer (BCA)'
        }
      ];
    } catch (e) {
      return [];
    }
  }

  function createOrder(orderData) {
    const orders = getOrders();
    const orderId = 'SEC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newOrder = {
      orderId: orderId,
      date: dateFormatted,
      items: orderData.items || getCart(),
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      status: 'Confirmed',
      shippingAddress: orderData.shippingAddress || 'Default Address',
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      paymentMethod: orderData.paymentMethod || 'Bank Transfer'
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    clearCart();
    localStorage.removeItem(STORAGE_KEYS.BUY_NOW);
    return newOrder;
  }

  // --- User Session ---
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
    } catch (e) {
      return null;
    }
  }

  function updateCurrentUser(userData) {
    const user = { ...getCurrentUser(), ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  // --- Floating Toast System ---
  function showToast(title, message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-pill';

    let iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    if (type === 'error') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c94a4a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    } else if (type === 'info') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  // --- Badge Synchronization ---
  function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badges = document.querySelectorAll('.cart-badge, #cart-count');
    badges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  // Setup DOM listeners
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.CART) {
      updateCartBadges();
      window.dispatchEvent(new CustomEvent('secondstyle:cart-updated', { detail: { cart: getCart() } }));
    }
  });

  // Expose global store
  window.SecondStyleStore = {
    getCart,
    saveCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getPromo,
    applyPromo,
    removePromo,
    getCartTotals,
    getOrders,
    createOrder,
    getCurrentUser,
    updateCurrentUser,
    showToast,
    formatCurrency,
    updateCartBadges,
    STORAGE_KEYS
  };
})();
