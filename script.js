// Function to load images from a folder
async function loadImagesFromFolder(folderPath) {
    try {
        const response = await fetch(folderPath);
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const imageFiles = Array.from(htmlDoc.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => /\.(jpg|jpeg|png|gif|webp)$/i.test(href));
        return imageFiles;
    } catch (error) {
        console.error('Error loading images:', error);
        return [];
    }
}

// Load header background images
async function loadHeaderImages() {
    const headerCarousel = document.getElementById('header-carousel');
    const images = await loadImagesFromFolder('/assets/bigben/');
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        headerCarousel.appendChild(img);
    });
}

// Load card images
async function loadCardImages() {
    const listings = document.getElementById('listings');
    const cardFolders = ['/assets/7castle/', '/assets/alladinCastle/', '/assets/bigben/','/assets/7castle/', '/assets/alladinCastle/', '/assets/bigben/'];
    for (const folder of cardFolders) {
        const images = await loadImagesFromFolder(folder);
        if (images.length > 0) {
            const card = document.createElement('div');
            card.className = 'card';
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-scroll-container';
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = image;
                imageContainer.appendChild(img);
            });
            card.appendChild(imageContainer);
            card.innerHTML += `
                <button class="scroll-button left" onclick="scrollImage(this, -1)">&#10094;</button>
                <button class="scroll-button right" onclick="scrollImage(this, 1)">&#10095;</button>
                <h3>Test Card</h3>
                <p>bt tag test</p>
            `;
            listings.appendChild(card);
        }
    }
}

// Smooth hover effect for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Scroll image function
function scrollImage(button, direction) {
    const container = button.parentElement.querySelector('.image-scroll-container');
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of the container width
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const filterBar = document.querySelector('.filter-bar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        filterBar.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        filterBar.classList.remove('scrolled');
    }
});

// Auto-scrolling background images in header
let currentIndex = 0;
function showNextImage() {
    const headerCarousel = document.querySelector('.header-carousel');
    const images = headerCarousel.querySelectorAll('img');
    if (images.length > 0) {
        currentIndex = (currentIndex + 1) % images.length;
        const offset = -currentIndex * 100;
        headerCarousel.style.transform = `translateX(${offset}%)`;
    }
}

// Load images and start carousel
(async () => {
    await loadHeaderImages();
    await loadCardImages();
    setInterval(showNextImage, 5000); // Change image every 5 seconds
})();