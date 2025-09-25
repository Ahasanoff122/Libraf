import books from "../../db/db.js"; 


const authorsList = document.getElementById("authorsList");

function getAllBooks() {
    return books;
}

function getAllAuthors() {
    const authors = [...new Set(
        books
            .map(b => b.author)
            .filter(a => a && a !== "Müəllif məlumatı yoxdur")
    )];
    return authors.sort((a, b) => a.localeCompare(b, "az"));
}

function renderAuthors() {
    const authors = getAllAuthors();
    if (!authors.length) {
        authorsList.innerHTML = `<p class="text-gray-500">Müəllif siyahısı tapılmadı.</p>`;
        return;
    }

    const grouped = {};
    authors.forEach(a => {
        const letter = a.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(a);
    });

    let html = "";
    Object.keys(grouped).sort().forEach(letter => {
        html += `<div class="col-span-full">
                    <h2 class="text-xl font-bold mb-2 text-red-600">${letter}</h2>
                 </div>`;
        grouped[letter].forEach(a => {
            html += `<div class="text-sm">
                        <a href="author-books.html?author=${encodeURIComponent(a)}" 
                           class="text-gray-800 hover:text-red-600">
                            ${a}
                        </a>
                     </div>`;
        });
    });

    authorsList.innerHTML = html;
}

renderAuthors();
