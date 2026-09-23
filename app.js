/**
 * MATI STORE - MOTOR DE LA TIENDA
 */

// Catálogo completo con todas las fotos cargadas
const PRODUCTS = [
    {
        id: "cinturon-fino-negro",
        name: "Cinturon fino - Negro",
        category: "negro",
        price: 10000,
        images: [
            "images/cinturon_fino_negro_1.png",
            "images/cinturon_fino_negro_2.png",
            "images/cinturon_fino_negro_3.png"
        ],
        description: "Cinturón fino en ecocuero negro con hebilla metálica dorada clásica."
    },
    {
        id: "cinturon-boho-marron",
        name: "Cinturon boho - Marron antiguo",
        category: "marron",
        price: 15000,
        images: [
            "images/cinturon_boho_marron_1.png",
            "images/cinturon_boho_marron_2.png"
        ],
        description: "Cinturón ancho estilo boho en tono marrón antiguo con tachas doradas y hebilla circular."
    },
    {
        id: "cinturon-boho-black",
        name: "Cinturon Boho - Black",
        category: "negro",
        price: 15000,
        images: [
            "images/Cinturon Boho - Black.png",
            "images/Cinturon Boho - Black 2.png"
        ],
        description: "Cinturón ancho estilo boho en color negro con tachas metálicas circulares."
    },
    {
        id: "cinturon-bull-vintage-brown",
        name: "Cinturon Bull - Vintage Brown",
        category: "marron",
        price: 15000,
        images: [
            "images/Cinturon Bull - Vintage Brown_1.avif",
            "images/Cinturon Bull - Vintage Brown_2.avif",
            "images/Cinturon Bull - Vintage Brown_3.avif"
        ],
        description: "Cinturón estilo texano con repujado floral y hebilla labrada Black Bull en tono marrón vintage."
    },
    {
        id: "cinturon-flower-vintage-brown",
        name: "Cinturon Flower - Vintage Brown",
        category: "marron",
        price: 15000,
        images: [
            "images/Cinturon Flower - Vintage Brown.avif",
            "images/Cinturon Flower - Vintage Brown2.avif",
            "images/Cinturon Flower - Vintage Brown3.avif"
        ],
        description: "Cinturón con grabado retro, pasador y puntera metálica trabajada en relieve."
    },
    {
        id: "cinturon-rustic-black",
        name: "Cinturon Rustic - Black",
        category: "negro",
        price: 12500,
        images: [
            "images/Cinturon Rustic - Black.png",
            "images/Cinturon Rustic - Black 2.png",
            "images/Cinturon Rustic - Black 3.png"
        ],
        description: "Cinturón rústico negro con tachas cuadradas y ojalillos metálicos."
    },
    {
        id: "cinturon-rustic-brown",
        name: "Cinturon Rustic - Brown",
        category: "marron",
        price: 12500,
        images: [
            "images/Cinturon Rustic - Brown 1.png",
            "images/Cinturon Rustic - Brown 2.png"
        ],
        description: "Cinturón rústico marrón con apliques y remaches metálicos envejecidos."
    },
    {
        id: "cinturon-tachas-black",
        name: "Cinturon Tachas - Black",
        category: "negro",
        price: 13500,
        images: [
            "images/Cinturon Tachas - Black 1.png",
            "images/Cinturon Tachas - Black 2.png"
        ],
        description: "Cinturón negro con tachas metálicas continuas y hebilla clásica."
    },
    {
        id: "cinturon-tachas-brown",
        name: "Cinturon Tachas - Brown",
        category: "marron",
        price: 13500,
        images: [
            "images/Cinturon Tachas - Brown 1.png",
            "images/Cinturon Tachas - Brown 2.png"
        ],
        description: "Cinturón marrón con tachas metálicas circulares y pasador reforzado."
    }
];

// Estado
const state = {
    products: PRODUCTS,
    filteredProducts: PRODUCTS,
    activeCategory: "all",
    searchQuery: "",
    activeModalProduct: null,
    activeModalImgIndex: 0
};

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    applyStoreMetadata();
    renderCategories();
    setupEventListeners();
    applyFilters();
});

function applyStoreMetadata() {
    document.title = STORE_CONFIG.storeName;
    document.querySelectorAll(".store-name-text").forEach(el => el.textContent = STORE_CONFIG.storeName);
    
    const bannerTitle = document.getElementById("banner-title");
    if (bannerTitle) bannerTitle.textContent = STORE_CONFIG.bannerTitle;

    const waHeader = document.getElementById("header-wa-link");
    if (waHeader) {
        waHeader.href = `https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent("Hola, quisiera hacer una consulta sobre los productos de Mati Store")}`;
    }
}

function renderCategories() {
    const container = document.getElementById("category-filters");
    if (!container) return;

    container.innerHTML = STORE_CONFIG.categories.map(cat => `
        <button type="button" class="category-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
            ${cat.label}
        </button>
    `).join("");
}

function formatPrice(amount) {
    return amount.toLocaleString("es-AR");
}

function buildWhatsAppLink(product) {
    const message = `${STORE_CONFIG.whatsappMessagePrefix}"${product.name}" ($${formatPrice(product.price)})`;
    return `https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

function applyFilters() {
    let result = [...state.products];

    // Filtro por categoría (Todos, Negro, Marrón)
    if (state.activeCategory === "negro") {
        result = result.filter(p => p.category === "negro" || p.name.toLowerCase().includes("negro") || p.name.toLowerCase().includes("black"));
    } else if (state.activeCategory === "marron") {
        result = result.filter(p => p.category === "marron" || p.name.toLowerCase().includes("marron") || p.name.toLowerCase().includes("brown"));
    }

    // Buscador en tiempo real
    if (state.searchQuery.trim() !== "") {
        const query = state.searchQuery.toLowerCase().trim();
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    state.filteredProducts = result;
    renderProductsGrid();
}

function renderProductsGrid() {
    const grid = document.getElementById("products-grid");
    const emptyState = document.getElementById("empty-state");
    if (!grid) return;

    if (state.filteredProducts.length === 0) {
        grid.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    grid.innerHTML = state.filteredProducts.map(product => {
        const waLink = buildWhatsAppLink(product);
        const mainImg = product.images[0];
        const extraImagesCount = product.images.length;

        return `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image-wrapper" onclick="openProductModal('${product.id}')">
                    <img src="${mainImg}" alt="${product.name}" class="product-img" loading="lazy">
                    ${extraImagesCount > 1 ? `<span class="photos-count-badge">${extraImagesCount} fotos</span>` : ''}
                </div>

                <div class="product-info">
                    <h3 class="product-title" onclick="openProductModal('${product.id}')">${product.name}</h3>
                    
                    <div class="product-pricing">
                        <span class="current-price">${STORE_CONFIG.currencySymbol}${formatPrice(product.price)}</span>
                    </div>

                    <div class="card-actions">
                        <a href="${waLink}" target="_blank" rel="noopener" class="btn-buy" title="Comprar por WhatsApp">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.418 0-8 3.582-8 8 0 1.411.365 2.738 1.006 3.894l-1.071 3.915 4.025-1.056c1.114.607 2.383.947 3.731.947 4.418 0 8-3.582 8-8s-3.582-8-8-8z"/>
                            </svg>
                            <span>Comprar</span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function setupEventListeners() {
    // Categorías
    document.getElementById("category-filters")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-pill");
        if (!btn) return;

        document.querySelectorAll(".category-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeCategory = btn.dataset.category;
        applyFilters();
    });

    // Buscador
    const searchInput = document.getElementById("search-input");
    searchInput?.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        applyFilters();
    });

    // Cerrar modal
    document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);
    document.getElementById("product-modal")?.addEventListener("click", (e) => {
        if (e.target.id === "product-modal") closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}

/**
 * Abre el modal y muestra la galería de fotos del producto
 */
function openProductModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.activeModalProduct = product;
    state.activeModalImgIndex = 0;

    const modal = document.getElementById("product-modal");
    updateModalView();

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function updateModalView() {
    const product = state.activeModalProduct;
    if (!product) return;

    const modalMainImg = document.getElementById("modal-main-img");
    modalMainImg.src = product.images[state.activeModalImgIndex];

    document.getElementById("modal-title").textContent = product.name;
    document.getElementById("modal-price").textContent = `${STORE_CONFIG.currencySymbol}${formatPrice(product.price)}`;
    document.getElementById("modal-desc").textContent = product.description || "";

    const waLink = buildWhatsAppLink(product);
    const buyBtn = document.getElementById("modal-buy-link");
    buyBtn.href = waLink;
    buyBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.418 0-8 3.582-8 8 0 1.411.365 2.738 1.006 3.894l-1.071 3.915 4.025-1.056c1.114.607 2.383.947 3.731.947 4.418 0 8-3.582 8-8s-3.582-8-8-8z"/>
        </svg>
        <span>Comprar por WhatsApp</span>
    `;

    // Renderizar miniaturas
    const thumbsContainer = document.getElementById("modal-thumbs");
    if (thumbsContainer) {
        if (product.images.length > 1) {
            thumbsContainer.innerHTML = product.images.map((img, idx) => `
                <button type="button" class="modal-thumb-btn ${idx === state.activeModalImgIndex ? 'active' : ''}" onclick="selectModalImage(${idx})">
                    <img src="${img}" alt="Miniatura ${idx + 1}">
                </button>
            `).join("");
            thumbsContainer.style.display = "flex";
        } else {
            thumbsContainer.style.display = "none";
        }
    }
}

function selectModalImage(index) {
    state.activeModalImgIndex = index;
    updateModalView();
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "";
    state.activeModalProduct = null;
}
