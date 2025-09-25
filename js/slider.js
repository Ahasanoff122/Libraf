const sliderContainer = document.getElementById('slider-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const sliderDots = document.getElementById('slider-dots');

const slides = [
    { image: 'https://www.libraff.az/images/abt__ut2/banners/all/1305/Hero-banner-desktop-20_-discount.webp' },
    { image: 'https://www.libraff.az/images/abt__ut2/banners/all/1314/web-3840x1000-Yay%C4%B1n-Son-Fu%CC%88rs%C9%99ti.webp' }
];

let currentIndex = 0;
let autoSlideInterval;

function renderSlides() {
    sliderContainer.innerHTML = '';
    slides.forEach(slide => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'w-full flex-shrink-0 h-full';
        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="Slider Image" class="w-full h-full object-cover rounded-2xl">
        `;
        sliderContainer.appendChild(slideDiv);
    });
}

function renderDots() {
    sliderDots.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gray-900 scale-110' : 'bg-gray-400'}`;
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
        sliderDots.appendChild(dot);
    });
}

function updateSlider() {
    sliderContainer.style.transform = `translateX(${-currentIndex * 100}%)`;
    renderDots();
}

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}


nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });


renderSlides();
updateSlider();
startAutoSlide();
