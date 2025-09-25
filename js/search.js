import booksData from '../db/db.js';


let currentIndex = 0;
const visibleCount = 50;

const booksContainer = document.querySelector('#books');
const searchInput = document.querySelector('#searchInput');

// Düymələr üçün wrapper
const buttonsWrapper = document.createElement("div");
buttonsWrapper.className = "flex justify-center gap-4 mt-4";
booksContainer.after(buttonsWrapper);

// "Geri" düyməsi
const prevBtn = document.createElement("button");
prevBtn.textContent = "Geri";
prevBtn.className = "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600";
prevBtn.style.display = "none";
buttonsWrapper.appendChild(prevBtn);

// "Daha çox" düyməsi
const loadMoreBtn = document.createElement("button");
loadMoreBtn.textContent = "Daha çox";
loadMoreBtn.className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600";
buttonsWrapper.appendChild(loadMoreBtn);


// Silinmiş kitabları filter edən funksiya
function filterDeletedBooks() {
    const deletedBooks = JSON.parse(localStorage.getItem("deletedBooks")) || [];
    return booksData.filter(book => !deletedBooks.includes(book.product_url));
}

// Slice-ları göstərən render funksiyası
function renderBooksSlice() {
    booksContainer.innerHTML = "";
    const filteredBooks = filterDeletedBooks();
    const slice = filteredBooks.slice(currentIndex, currentIndex + visibleCount);

    if(slice.length === 0) {
        booksContainer.innerHTML = '<p class="col-span-4 text-center text-gray-500">Heç bir kitab tapılmadı</p>';
        return;
    }

    slice.forEach(book => renderSingleBook(book));

    prevBtn.style.display = currentIndex > 0 ? "inline-block" : "none";
    loadMoreBtn.style.display = currentIndex + visibleCount < filteredBooks.length ? "inline-block" : "none";
}

// Single kitab render
function renderSingleBook(book) {
    const bookEl = document.createElement('div');
    bookEl.className = "border p-2 rounded shadow-sm flex flex-col";
    bookEl.innerHTML = `
        <img src="${book.image}" alt="${book.name}" class="w-full h-48 object-cover mb-2 rounded"/>
        <h2 class="font-bold text-sm  pb-2.5">${book.name}</h2>
        <p class="text-xm text-gray-500 pb-3">${book.author}</p>
       <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
        <div class="flex justify-between items-center pt-10">
          <button class="add-to-cart-btn bg-green-500 text-white px-3 py-1 rounded text-sm">Səbətə əlavə et</button>
          <div>
            <button class="like-btn text-red-500 mr-2" title="Like">❤️</button>
          </div>
        </div>
      `;
    booksContainer.appendChild(bookEl);

    bookEl.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(book));
    bookEl.querySelector('.like-btn').addEventListener('click', () => likeBook(book));
}

// Load more və prev düymələri
loadMoreBtn.addEventListener("click", () => {
    currentIndex += visibleCount;
    renderBooksSlice();
});

prevBtn.addEventListener("click", () => {
    currentIndex -= visibleCount;
    if (currentIndex < 0) currentIndex = 0;
    renderBooksSlice();
});

// Search funksiyası
// Search funksiyası
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredBooks = filterDeletedBooks().filter(book => 
            book.name.toLowerCase().includes(query) || 
            (book.author && book.author.toLowerCase().includes(query))
        );

        booksContainer.innerHTML = "";
        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = '<p class="col-span-4 text-center text-gray-500">Heç bir kitab tapılmadı</p>';
        } else {
            filteredBooks.forEach(book => renderSingleBook(book));
        }

        // Search zamanı səhifələmə düymələrini gizlət
        prevBtn.style.display = "none";
        loadMoreBtn.style.display = "none";
    });
}

// CART FUNKSİYALARI
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const urlsInCart = cart.map(item => item.product_url.toString());

    if (!urlsInCart.includes(book.product_url.toString())) {
        cart.push(book);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartModal();
        updateCartCount(); // Bu sətri renderCartModal-dan sonra əlavə et
        showToast(`${book.name} səbətə əlavə olundu!`, "success");
    } else {
        showToast("Bu kitab artıq səbətdədir!", "error");
    }
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = cart.length;
}

function renderCartModal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const list = document.getElementById("cart-list");
    if (!list) return;
    list.innerHTML = "";

    cart.forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "border p-2 rounded flex flex-col space-y-2";
        li.innerHTML = `
             <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author || ''}</p>
                    </div>
                    <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
                    <div class="mt-2 flex items-center justify-between">
                        <a href="pages/viewdetail.html?product=${book.product_url}" target="_blank" class="text-blue-500 text-xs hover:underline">View Details</a>
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);

        li.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(index));
    });
}

// LIKE FUNKSİYALARI
function likeBook(book) {
    let liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    if (!liked.some(item => item.product_url === book.product_url)) {
        liked.push(book);
        localStorage.setItem("likedBooks", JSON.stringify(liked));
        updateLikeCount();
        renderLikeModal();
        showToast(`${book.name} bəyənildi!`, "success");
    } else {
        showToast("Bu kitab artıq bəyənilib!", "error");
    }
}

function removeFromLiked(index) {
    let liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    liked.splice(index, 1);
    localStorage.setItem("likedBooks", JSON.stringify(liked));
    updateLikeCount();
    renderLikeModal();
}

function updateLikeCount() {
    const liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const countEl = document.getElementById("like-count");
    if (countEl) countEl.textContent = liked.length;
}

function renderLikeModal() {
    const liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const list = document.getElementById("like-list");
    if (!list) return;
    list.innerHTML = "";

    liked.forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "border p-2 rounded flex flex-col space-y-2";
        li.innerHTML = `
             <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author || ''}</p>
                        <a href="pages/viewdetail.html?product=${book.product_url}" target="_blank" class="text-blue-500 text-xs hover:underline">View Details</a>
                    </div>
                    <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
                    <div class="mt-2 flex items-center justify-between">
                        <button class="add-to-cart-btn bg-green-500 text-white px-3 py-1 rounded text-xs">Səbətə əlavə et</button>
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);

        li.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(book));
        li.querySelector(".remove-btn").addEventListener("click", () => removeFromLiked(index));
    });
}

// Toast mesajları
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    renderBooksSlice();
    updateCartCount();
    updateLikeCount();

    // Cart modal aç/bağla
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeCartBtn = document.getElementById("close-cart");
    if(cartIcon && cartModal) cartIcon.addEventListener("click", () => { renderCartModal(); cartModal.classList.remove("translate-x-full"); });
    if(closeCartBtn && cartModal) closeCartBtn.addEventListener("click", () => cartModal.classList.add("translate-x-full"));

    // Like modal aç/bağla
    const likeIcon = document.getElementById("like-icon");
    const likeModal = document.getElementById("like-modal");
    const closeLikeBtn = document.getElementById("close-like");
    if(likeIcon && likeModal) likeIcon.addEventListener("click", () => { renderLikeModal(); likeModal.classList.remove("translate-x-full"); });
    if(closeLikeBtn && likeModal) closeLikeBtn.addEventListener("click", () => likeModal.classList.add("translate-x-full"));
});
