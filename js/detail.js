import { getBookByURL } from "./service.js"; // service.js-də product_url ilə fetch edən funksiya olmalıdır

const detailCard = document.getElementById("detailCard");

// URL-dən product_url götürək
const query = location.search;
const product_url = new URLSearchParams(query).get("product_url");
console.log("Query product_url:", product_url);

async function useFetch() {
  if (!product_url) {
    detailCard.innerHTML = `<p class="text-red-500">Kitab URL-i tapılmadı. Zəhmət olmasa, ana səhifəyə qayıdın.</p>`;
    console.error("No product_url provided in query params");
    return;
  }

  const data = await getBookByURL(product_url); // product_url ilə məlumat çəkmək

  if (!data) {
    detailCard.innerHTML = `<p class="text-red-500">Kitab məlumatları tapılmadı. URL: ${product_url}</p>`;
    return;
  }

  printCardDet(data);
}

useFetch();

function printCardDet(bookObj) {
  detailCard.innerHTML = `
    <div class="flex flex-col lg:flex-row items-start lg:space-x-8 p-6 lg:p-12">
      <div class="flex-shrink-0 mb-6 lg:mb-0">
        <img src="${bookObj.image}" alt="${bookObj.name
    }" class="w-full lg:w-96 rounded-lg shadow-xl" />
      </div>

      <div class="flex-grow">
        <div class="text-xs text-gray-500 mb-4">
          Əsas səhifə / Kitab / Qeyri-bədi ədəbiyyat / Psixologiya / ${bookObj.name
    }
        </div>
        <div class="space-y-4">
          <div class="flex justify-end text-sm text-gray-500">
            Kod: <span class="ml-2">${bookObj.code || "2000052527966"}</span>
          </div>
          <h1 class="text-3xl font-bold">${bookObj.name}</h1>
          <p class="text-gray-600">${bookObj.author || ""}</p>
          <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
<div class="mt-2 flex items-center justify-between">
          <button class="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.27 3 12.016 3 13a1 1 0 100 2h1a1 1 0 100-2h1.615l.935-3.742a.25.25 0 00.003-.01l.933-3.732a.25.25 0 00-.003-.01L8.385 4H10a1 1 0 000-2H6.555L6.25 1.554a.996.996 0 00-.01-.042l-1.358-5.43.893-.892A2.997 2.997 0 005.615 1z" />
            </svg>
            <span>Səbətə əlavə et</span>
          </button>
          </div>
          
          <!-- Çatdırılma və digər bölmələr eyni -->
        </div>
      </div>
    </div>
  `;
}
