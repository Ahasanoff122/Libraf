import categoryData from './data.js';

        function renderMenu() {
            const container = document.getElementById("popupMenu");
            container.innerHTML = "";

            const leftCol = document.createElement("div");
            leftCol.className = "w-1/4 bg-gray-50 p-4 border-r";
            const midCol = document.createElement("div");
            midCol.className = "w-1/4 bg-gray-100 p-4 border-r";
            const rightCol = document.createElement("div");
            rightCol.className = "flex-1 bg-white p-4  links";

          
            categoryData.forEach((cat, index) => {
                const item = document.createElement("div");
                item.className = "py-2 px-3 cursor-pointer hover:bg-red-100 rounded";
                item.textContent = cat.name;

                item.addEventListener("mouseenter", () => {
                    renderSubcategories(cat.sub, midCol, rightCol);
                });

                leftCol.appendChild(item);
            });

            container.appendChild(leftCol);
            container.appendChild(midCol);
            container.appendChild(rightCol);
        }

      
        function renderSubcategories(subcategories, midCol, rightCol) {
            midCol.innerHTML = "";
            rightCol.innerHTML = "";

            subcategories.forEach(subcat => {
                const subItem = document.createElement("div");
                subItem.className = "py-2 px-3 cursor-pointer hover:bg-red-100 rounded";
                subItem.textContent = subcat.name;

                subItem.addEventListener("mouseenter", () => {
                    renderRightColumn(subcat.sub, rightCol);
                });

                midCol.appendChild(subItem);
            });
        }

      
      function renderRightColumn(items, rightCol) {
    rightCol.innerHTML = "";
    items.forEach(item => {
        const a = document.createElement("a");
        a.className = "py-1 cursor-pointer hover:text-red-600 block"; // block əlavə etmək məsləhətlidir
        a.textContent = item;
        a.href = './pages/catalog.html?category=' + encodeURIComponent(item);// ← burası yönləndirəcək
        rightCol.appendChild(a);
    });
}
console.log(a.href); 


        
        window.handlePopUp = function (status) {
            const popLayer = document.getElementById("popLayer");
            popLayer.style.display = status ? "block" : "none";
            if (status) renderMenu();
        };

