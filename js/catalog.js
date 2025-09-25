import booksData from '../db/db.js'; // db.js-də kitab array-i
import categoryData from './data.js';

const catalogSidebar = document.getElementById('catalog-sidebar');
const booksContainer = document.getElementById('booksContainer');

// ---------- CART & LIKE FUNKSİYALARI ----------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}
function updateLikeCount() {
    const liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    document.getElementById("like-count").textContent = liked.length;
}
function showToast(msg, type="success") {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${type==="success"?"bg-green-500":"bg-red-500"}`;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 2000);
}
function addToCart(book){
    let cart = JSON.parse(localStorage.getItem("cart"))||[];
    if(!cart.some(b=>b.product_url===book.product_url)){
        cart.push(book);
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCartModal();
        updateCartCount();
        showToast(`${book.name} səbətə əlavə olundu!`);
    } else showToast("Bu kitab artıq səbətdədir!", "error");
}
function removeFromCart(index){
    let cart = JSON.parse(localStorage.getItem("cart"))||[];
    cart.splice(index,1);
    localStorage.setItem("cart",JSON.stringify(cart));
    renderCartModal();
    updateCartCount();
}
function renderCartModal(){
    const cart = JSON.parse(localStorage.getItem("cart"))||[];
    const list = document.getElementById("cart-list");
    list.innerHTML = "";
    cart.forEach((book,index)=>{
        const li = document.createElement("li");
        li.className="border p-2 rounded flex flex-col space-y-2";
        li.innerHTML=`
            <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author||""}</p>
                    </div>
                    <div class="price">
                        <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
                        <span class="text-red-500 font-bold">${book.price}₼</span>
                    </div>
                    <div class="mt-2">
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);
        li.querySelector(".remove-btn").addEventListener("click",()=>removeFromCart(index));
    });
}

function likeBook(book){
    let liked = JSON.parse(localStorage.getItem("likedBooks"))||[];
    if(!liked.some(b=>b.product_url===book.product_url)){
        liked.push(book);
        localStorage.setItem("likedBooks",JSON.stringify(liked));
        renderLikeModal();
        updateLikeCount();
        showToast(`${book.name} bəyənildi!`);
    } else showToast("Bu kitab artıq bəyənilib!", "error");
}
function removeFromLiked(index){
    let liked = JSON.parse(localStorage.getItem("likedBooks"))||[];
    liked.splice(index,1);
    localStorage.setItem("likedBooks",JSON.stringify(liked));
    renderLikeModal();
    updateLikeCount();
}
function renderLikeModal(){
    const liked = JSON.parse(localStorage.getItem("likedBooks"))||[];
    const list = document.getElementById("like-list");
    list.innerHTML="";
    liked.forEach((book,index)=>{
        const li = document.createElement("li");
        li.className="border p-2 rounded flex flex-col space-y-2";
        li.innerHTML=`
            <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author||""}</p>
                    </div>
                    <div class="price">
                        <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
                        <span class="text-red-500 font-bold">${book.price}₼</span>
                    </div>
                    <div class="mt-2 flex justify-between">
                        <button class="add-to-cart-btn bg-green-500 text-white px-3 py-1 rounded text-xs">Səbətə əlavə et</button>
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);
        li.querySelector(".add-to-cart-btn").addEventListener("click",()=>addToCart(book));
        li.querySelector(".remove-btn").addEventListener("click",()=>removeFromLiked(index));
    });
}

// ---------- BOOKS RENDER ----------
function renderBooks(books){
    booksContainer.innerHTML="";
    if(books.length===0){
        booksContainer.innerHTML='<p class="col-span-4 text-center text-gray-500">Heç bir kitab tapılmadı</p>';
        return;
    }
    books.forEach(book=>{
        const div = document.createElement("div");
        div.className="border p-2 rounded shadow-sm flex flex-col";
        div.innerHTML=`
           <img src="${book.image}" alt="${book.name}" class="w-full h-48 object-cover mb-2 rounded"/>
           <h2 class="font-bold text-sm pb-2.5">${book.name}</h2>
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
        booksContainer.appendChild(div);
        div.querySelector(".add-to-cart-btn").addEventListener("click",()=>addToCart(book));
        div.querySelector(".like-btn").addEventListener("click",()=>likeBook(book));
    });
}

// ---------- CATALOG SIDEBAR (REKURSİV) ----------
function renderCategory(categories, container){
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.className = "category-item";

        if(typeof cat === "string"){
            const span = document.createElement("span");
            span.textContent = cat;
            span.className = "cursor-pointer font-normal ml-4";

            span.addEventListener("click", () => {
                // URL query param əlavə et
                const url = new URL(window.location);
                url.searchParams.set('category', cat);
                window.history.pushState({}, '', url);

                const filteredBooks = booksData.filter(b => b.category === cat);
                renderBooks(filteredBooks);
            });

            li.appendChild(span);
        } else {
            const span = document.createElement("span");
            span.textContent = cat.name;
            span.className = "cursor-pointer font-semibold";
            li.appendChild(span);

            if(cat.sub && cat.sub.length > 0){
                const subUl = document.createElement("ul");
                subUl.className = "ml-4 hidden";
                li.appendChild(subUl);
                renderCategory(cat.sub, subUl);
                span.addEventListener("click", () => subUl.classList.toggle("hidden"));
            } else {
                span.addEventListener("click", () => {
                    const url = new URL(window.location);
                    url.searchParams.set('category', cat.name);
                    window.history.pushState({}, '', url);

                    const filteredBooks = booksData.filter(b => b.category === cat.name);
                    renderBooks(filteredBooks);
                });
            }
        }

        container.appendChild(li);
    });
}

const ul = document.createElement("ul");
catalogSidebar.appendChild(ul);
renderCategory(categoryData, ul);

// ---------- MODALS & INITIALIZATION ----------
document.addEventListener("DOMContentLoaded",()=>{
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeCartBtn = document.getElementById("close-cart");
    if(cartIcon && cartModal) cartIcon.addEventListener("click",()=>{renderCartModal();cartModal.classList.remove("translate-x-full");});
    if(closeCartBtn && cartModal) closeCartBtn.addEventListener("click",()=>cartModal.classList.add("translate-x-full"));

    const likeIcon = document.getElementById("like-icon");
    const likeModal = document.getElementById("like-modal");
    const closeLikeBtn = document.getElementById("close-like");
    if(likeIcon && likeModal) likeIcon.addEventListener("click",()=>{renderLikeModal();likeModal.classList.remove("translate-x-full");});
    if(closeLikeBtn && likeModal) closeLikeBtn.addEventListener("click",()=>likeModal.classList.add("translate-x-full"));
    updateCartCount();
    updateLikeCount();

    // URL query param varsa filtr tətbiq et
    const params = new URLSearchParams(window.location.search);
    const categoryFromURL = params.get('category');
    if(categoryFromURL){
        const filteredBooks = booksData.filter(b => b.category === categoryFromURL);
        renderBooks(filteredBooks);
    } else {
        renderBooks(booksData);
    }
    searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get('category');
  const filteredBooks = booksData.filter(book =>
      (categoryFromURL ? book.category === categoryFromURL : true) &&
      (book.name.toLowerCase().includes(query) ||
       (book.author && book.author.toLowerCase().includes(query)))
  );
  renderBooks(filteredBooks);
});

    
     
});
