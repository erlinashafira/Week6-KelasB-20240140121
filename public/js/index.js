
const API_URL = "https://dummyjson.com/products?limit=100";

const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

let allProducts = [];

function formatPrice(usd) {
  return `$${usd.toFixed(2)}`;
}

function renderProducts(products) {
  gridEl.innerHTML = "";

  if (products.length === 0) {
    statusEl.textContent = "Produk tidak ditemukan.";
    statusEl.classList.remove("error");
    statusEl.style.display = "block";
    return;
  }

  statusEl.style.display = "none";

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const isLowStock = product.stock < 10;

    card.innerHTML = `
      <span class="stock-badge ${isLowStock ? "low" : ""}">
        ${isLowStock ? "Stok Menipis" : "Tersedia"}
      </span>
      <div class="thumb-wrap">
        <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
      </div>
      <div class="body">
        <div class="category">${product.category}</div>
        <h3>${product.title}</h3>
        <div class="meta">${product.brand || "-"} &middot; stok: ${product.stock}</div>
        <div class="footer-row">
          <div class="price-tag">
            ${formatPrice(product.price)}
            <span class="discount">-${Math.round(product.discountPercentage)}% diskon</span>
          </div>
          <div class="rating">★ ${product.rating.toFixed(2)}</div>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
}


function populateCategoryOptions(products) {
  const categories = [...new Set(products.map((p) => p.category))].sort();

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

/**
 * Filter {@link allProducts} berdasarkan kata kunci pencarian dan kategori
 * yang dipilih, lalu render ulang hasilnya.
 * @returns {void}
 */
function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = allProducts.filter((product) => {
    const matchKeyword = product.title.toLowerCase().includes(keyword);
    const matchCategory = category ? product.category === category : true;
    return matchKeyword && matchCategory;
  });

  renderProducts(filtered);
}

/**
 * Ambil produk dari {@link API_URL}, isi dropdown kategori, lalu render semua produk.
 * Kalau gagal, pesan error ditampilkan di elemen status.
 * @returns {Promise<void>}
 */
async function fetchProducts() {
  try {
    statusEl.textContent = "Memuat produk...";
    statusEl.classList.remove("error");
    statusEl.style.display = "block";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request gagal dengan status ${response.status}`);
    }

    const data = await response.json();
    allProducts = data.products;

    populateCategoryOptions(allProducts);
    renderProducts(allProducts);
  } catch (error) {
    statusEl.textContent = `Gagal memuat data: ${error.message}`;
    statusEl.classList.add("error");
    statusEl.style.display = "block";
    console.error("Fetch error:", error);
  }
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);

document.addEventListener("DOMContentLoaded", fetchProducts);
