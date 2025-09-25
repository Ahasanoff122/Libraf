import booksData from "../../db/db.js"  
// DOM elementi
const booksContainer = document.getElementById("books");

// Bütün kitabları ekrana çıxarma funksiyası
function printAllBooks(data) {
    booksContainer.innerHTML = ""; 
    
    // İlk 50 kitabı seçirik
    const limitedBooks = data.slice(0, 50);

    limitedBooks.forEach(book => {
        const div = document.createElement("div");
        div.className = "border p-4 rounded shadow mb-4";
        div.innerHTML = `
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
       booksContainer.appendChild(div);

    });
}

// Auth UI

document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
});


window.addToCart = addToCart;
window.likeBook = likeBook;

