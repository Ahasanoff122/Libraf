// service.js
import booksData from "../db/db.js"  

// Bütün kitabları al
export async function getAllBooks() {
  // Hər kitaba id əlavə edirik (unikal identifikator = product_url)
  return booksData.map(book => ({ ...book, id: book.product_url }));
}

// product_url-a görə kitabı al
export async function getBookByID(id) {
  const book = booksData.find(b => b.product_url === id);
  return book ? { ...book, id: book.product_url } : null;
}

// Kitabı yenilə (yalnız lokal dəyişir, serverdə dəyişiklik yoxdur)
export async function updateBookByID(id, updatedBook) {
  const index = booksData.findIndex(b => b.product_url === id);
  if (index === -1) throw new Error("Kitab tapılmadı");
  booksData[index] = { ...booksData[index], ...updatedBook };
  return true;
}

// Kitabı sil (yalnız lokal)
export async function deleteBookByID(id) {
  const index = booksData.findIndex(b => b.product_url === id);
  if (index === -1) throw new Error("Kitab tapılmadı");
  booksData.splice(index, 1);
  return true;
}

// Yeni kitab əlavə et (yalnız lokal)
export async function createNewBook(newBook) {
  booksData.push(newBook);
  return newBook.product_url; // id kimi product_url qaytarılır
}

// Müəllifləri al
export async function getAllAuthors() {
  const authors = new Set(
    booksData
      .map(b => b.author)
      .filter(a => a && a !== "Müəllif məlumatı yoxdur") // boş və məlumatsızları çıxarır
  );
  return Array.from(authors).sort((a, b) => a.localeCompare(b, "az"));
}
