import categoryData from './data.js';

const catalogPopup = document.getElementById('catalog-sidebar-popup');
const catalogButton = document.querySelector('.header-catalog-button');

catalogPopup.classList.add('hidden');

function handlePopUp(open) {
    if (open) {
        catalogPopup.classList.remove('hidden');
        renderHeaderCatalog();
    } else {
        catalogPopup.classList.add('hidden');
        document.querySelectorAll('.flyout').forEach(f => f.remove());
    }
}

catalogButton.addEventListener('click', e => {
    e.stopPropagation();
    handlePopUp(true);
});

catalogPopup.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => handlePopUp(false));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') handlePopUp(false);
});

// Flyout yaratmaq
function createFlyout(items, level, parentLink, leftPanelWidth) {
    const container = document.createElement('div');
    container.className = `flyout level-${level}`;
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '15px', // həmişə pop-up-un yuxarısından başlayır
        left: leftPanelWidth + (level - 1) * 300 + 'px',
        zIndex: 200 + level,
        backgroundColor: 'transparent'
    });

    items.forEach(item => {
        const link = document.createElement('a');
        link.textContent = item.name || item;
        Object.assign(link.style, {
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '600',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            backgroundColor: 'transparent'
        });

        link.addEventListener('mouseenter', () => {
            document.querySelectorAll(`.flyout.level-${level+1}`).forEach(f => f.remove());
            if (item.sub && item.sub.length) {
                const subContainer = createFlyout(item.sub, level + 1, link, leftPanelWidth);
                catalogPopup.appendChild(subContainer);
            }
        });

        const isInPagesFolder = window.location.pathname.includes("/pages/");
        link.href = isInPagesFolder
            ? `catalog.html?category=${encodeURIComponent(item.name || item)}`
            : `pages/catalog.html?category=${encodeURIComponent(item.name || item)}`;

        container.appendChild(link);
    });

    return container;
}




// Əsas menyunu render et
function renderHeaderCatalog() {
    if (catalogPopup.dataset.rendered === 'true') return;
    catalogPopup.dataset.rendered = 'true';
    catalogPopup.innerHTML = '';

    const leftPanel = document.createElement('div');
    Object.assign(leftPanel.style, {
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #ccc',
        position: 'relative',
       
    });

    categoryData.forEach(cat => {
        const catLink = document.createElement('a');
        catLink.textContent = cat.name;
        Object.assign(catLink.style, {
            padding: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            // borderBottom: '1px solid #eee',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            backgroundColor: '#fff',
            position: 'relative',
            left: '20px'
        });

        const isInPagesFolder = window.location.pathname.includes("/pages/");
        catLink.href = isInPagesFolder
            ? `catalog.html?category=${encodeURIComponent(cat.name)}`
            : `pages/catalog.html?category=${encodeURIComponent(cat.name)}`;

        catLink.addEventListener('mouseenter', () => {
            document.querySelectorAll('.flyout').forEach(f => f.remove());
            if (cat.sub && cat.sub.length) {
                const flyout = createFlyout(cat.sub, 1, catLink, leftPanel.offsetWidth);
                catalogPopup.appendChild(flyout);
            }
        });

        leftPanel.appendChild(catLink);
    });

    catalogPopup.appendChild(leftPanel);
}

renderHeaderCatalog();
window.handlePopUp = handlePopUp;
