// admin.js
import { 
  getAllBooks, 
  createNewBook, 
  deleteBookByID, 
  getBookByID, 
  updateBookByID 
} from "./service.js";

const tbody = document.querySelector("tbody");
const container = document.querySelector(".container");

// Create New Book button
const createBtn = document.createElement("button");
createBtn.textContent = "Create New Book";
createBtn.className = "mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
createBtn.addEventListener("click", openCreateForm);
container.prepend(createBtn);

// ---------- Load Books ----------
async function fetchData() {
  try {
    const books = await getAllBooks();
    loadBooks(books);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="6" class="p-3 text-center">Failed to load data</td></tr>`;
  }
}

function loadBooks(books) {
  tbody.innerHTML = "";
  books.forEach((book, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-3">${index + 1}</td>
      <td class="p-3">
        <img src="${book.image || ''}" alt="${book.name || ''}" class="w-12 h-16 object-cover rounded" />
      </td>
      <td class="p-3 font-semibold">${book.name || ''}</td>
      <td class="p-3">${book.price || ''}</td>
      <td class="p-3 text-center">${book.category || ''}</td>
      <td class="p-3 flex gap-3">
        <button class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700" onclick="editBook('${book.product_url}')">Edit</button>
        <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onclick="deleteBook('${book.product_url}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- Create ----------
async function openCreateForm() {
  const { value: formValues } = await Swal.fire({
    title: "Create New Book",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Book Name">
      <input id="swal-genre" class="swal2-input" placeholder="Genre">
      <input id="swal-price" class="swal2-input" type="number" placeholder="Price">
      <input id="swal-category" class="swal2-input" placeholder="Category">
      <input id="swal-image" class="swal2-input" placeholder="Image URL">
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value.trim();
      const genre = document.getElementById("swal-genre").value.trim();
      const price = parseFloat(document.getElementById("swal-price").value);
      const category = document.getElementById("swal-category").value.trim();
      const image = document.getElementById("swal-image").value.trim();

      // Unikal product_url yaratmaq: kitab adı + timestamp
      const product_url = `book-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

      return { name, genre, price, category, image, product_url };
    }
  });

  if (!formValues || !formValues.name || !formValues.genre) {
    Swal.fire("Error", "Name and genre are required!", "error");
    return;
  }

  await createNewBook(formValues);
  Swal.fire("Success", "Kitab uğurla yaradıldı ✅", "success");
  fetchData();
}


// ---------- Delete ----------
window.deleteBook = async (id) => {
  const confirmed = await Swal.fire({
    title: "Əminsənmi?",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Bəli, sil",
  });

  if (!confirmed.isConfirmed) return;

  try {
    const book = await getBookByID(id); // silinən kitabın məlumatını götür
    await deleteBookByID(id);

    // Table-dan dərhal sil
    const row = document.querySelector(`button[onclick="deleteBook('${id}')"]`)?.closest("tr");
    if (row) row.remove();

    // ✅ Silinmiş kitabı localStorage-a əlavə et
    const deletedBooks = JSON.parse(localStorage.getItem("deletedBooks")) || [];
    deletedBooks.push(book.product_url);
    localStorage.setItem("deletedBooks", JSON.stringify(deletedBooks));

    Swal.fire("Silindi!", "Kitab silindi.", "success");
  } catch (err) {
    console.error(err);
    Swal.fire("Xəta", "Kitabı silmək alınmadı", "error");
  }
};

// Kitabı uğurla siləndən sonra
const deletedBook = await getBookByID('${book.product_url}');
if (deletedBook) {
    // localStorage-da "deletedBooks" array-a əlavə et
    let deletedBooks = JSON.parse(localStorage.getItem("deletedBooks")) || [];
    deletedBooks.push(deletedBook.product_url);
    localStorage.setItem("deletedBooks", JSON.stringify(deletedBooks));
}

// ---------- Edit ----------
window.editBook = async (id) => {
  try {
    const book = await getBookByID(id);
    if (!book) throw new Error("Kitab tapılmadı");

    const { value: formValues } = await Swal.fire({
      title: "Edit Book",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Book Name" value="${book.name || ''}">
        <input id="swal-genre" class="swal2-input" placeholder="Genre" value="${book.genre || ''}">
        <input id="swal-price" class="swal2-input" type="number" placeholder=price value="${book.price || ''}">
        <input id="swal-category" class="swal2-input" placeholder=category value="${book.category || ''}">
        <input id="swal-image" class="swal2-input" placeholder="Image URL" value="${book.image || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        name: document.getElementById("swal-name").value.trim(),
        genre: document.getElementById("swal-genre").value.trim(),
        price: parseFloat(document.getElementById("swal-price").value),
        category: document.getElementById("swal-category").value.trim(),
        image: document.getElementById("swal-image").value.trim()
      })
    });

    if (!formValues || !formValues.name || !formValues.genre) {
      Swal.fire("Error", "Name and genre are required!", "error");
      return;
    }

    await updateBookByID(id, formValues);
    Swal.fire("Success!", "Book updated!", "success");
    fetchData();
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};

// ---------- Import books from db.js ----------
async function importBooks() {
  try {
    const res = await fetch("db/db.js");
    const data = await res.json();

    for (let book of data.books) {
      await createNewBook(book);
      console.log(`Added: ${book.name}`);
    }

    Swal.fire("Success", "Bütün kitablar Firestore-a əlavə edildi ✅", "success");
    fetchData();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Kitabları import etmək alınmadı ❌", "error");
  }
}

// İlk dəfə səhifə yüklənəndə
document.addEventListener("DOMContentLoaded", fetchData);
