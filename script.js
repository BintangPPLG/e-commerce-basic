// Ambil dan tampilkan list produk dari FakeStoreAPI di index.html
async function fetchFakeStoreProducts() {
  const container = document.getElementById("fakestore-products");
  if (!container) return;

  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-sm";

      card.innerHTML = `
        <div class="relative">
          <span class="absolute top-0 left-0 bg-[#f3d4d4] text-black text-xs px-2 py-1 rounded-br-md font-semibold">25%</span>
          <img src="${product.image}" alt="${product.title}" class="w-36 h-36 object-contain mx-auto" />
        </div>
        <p class="text-center text-sm font-semibold mt-2 line-clamp-2">${product.title}</p>
        <div class="text-center my-1">
          <span class="text-red-500 line-through text-xs">$${(product.price * 1.33).toFixed(2)}</span>
          <span class="text-black text-sm font-bold ml-1">$${product.price.toFixed(2)}</span>
        </div>
        <button onclick="window.location.href='detailproduk.html?productId=${product.id}'"
          class="mt-2 bg-gradient-to-r from-black to-gray-700 text-white text-sm px-4 py-1.5 rounded-lg hover:scale-105 transform transition duration-300 shadow-md w-full">
          Buy
        </button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    if (container) {
      container.innerHTML = "<p class='text-red-500 text-center'>Failed to load products.</p>";
    }
    console.error("Error fetching FakeStoreAPI products:", error);
  }
}

// Ambil productId dari URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("productId");
}

// Ambil data produk dari API
async function fetchProduct(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error("Produk tidak ditemukan");
    const product = await res.json();
    return product;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Render detail produk di halaman detail
function renderProductDetail(product) {
  if (!product) return;

  const mainImage = document.getElementById("main-image");
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.title;
  }

  const thumbsContainer = document.getElementById("thumbnails");
  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const thumb = document.createElement("img");
      thumb.src = product.image;
      thumb.alt = "thumb";
      thumb.className = "w-full rounded cursor-pointer";
      thumb.addEventListener("click", () => {
        if (mainImage) mainImage.src = product.image;
      });
      thumbsContainer.appendChild(thumb);
    }
  }

  const titleEl = document.getElementById("product-title");
  if (titleEl) titleEl.textContent = product.title;

  const descEl = document.getElementById("product-description");
  if (descEl) descEl.textContent = product.description;

  const colorEl = document.getElementById("product-color");
  if (colorEl) colorEl.textContent = "BLACK";
}

// Simpan dan ambil data keranjang dari localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Tampilkan jumlah item di ikon keranjang
function updateCartCount() {
  const cart = loadCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = total;
  }
}

// Tampilkan notifikasi saat tambah ke keranjang
function showNotification() {
  const notif = document.getElementById("cart-notification");
  if (!notif) return;

  notif.classList.remove("hidden");
  setTimeout(() => {
    notif.classList.add("hidden");
  }, 2000);
}

// Tambah produk ke keranjang
function addToCart(product, quantity = 1) {
  let cart = loadCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
  updateCartCount();
  showNotification();
}

// Saat halaman dibuka
document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("fakestore-products")) {
    fetchFakeStoreProducts();
    updateCartCount();
  }

  if (document.getElementById("product-title")) {
    const productId = getProductIdFromURL();
    if (!productId) {
      alert("Produk tidak ditemukan. ID produk tidak ada di URL.");
      return;
    }

    const product = await fetchProduct(productId);
    renderProductDetail(product);
    updateCartCount();

    const addBtn = document.getElementById("add-to-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const qtyInput = document.querySelector("input[type='number']");
        const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        addToCart(product, quantity);
      });
    }

    const buyNowBtn = document.querySelector("button.bg-black");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const qtyInput = document.querySelector("input[type='number']");
        const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

        const buyNowData = {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: quantity
        };

        localStorage.setItem("buyNowItem", JSON.stringify(buyNowData));
        window.location.href = "checkout.html";
      });
    }
  }
});
