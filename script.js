
const searchQueryInput = document.getElementById('search-query');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.querySelector('.results');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumber = document.getElementById('page-number');
const imageTemplate = document.getElementById('image-template');
let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';
let currentCategory = '';
let isSearchMode = false;



prevButton.style.display = 'none';
nextButton.style.display = 'none';
pageNumber.style.display = 'none';



function clearSearchInput() {
    searchQueryInput.value = '';
}


document.getElementById('nature-btn').addEventListener('click', () => {
    currentCategory = 'nature';
    currentPage = 1;
    isSearchMode = false;
    clearSearchInput();
    fetchImagesByCategory(currentCategory, currentPage);
});
document.getElementById('animals-btn').addEventListener('click', () => {
    currentCategory = 'animals';
    currentPage = 1;
    isSearchMode = false;
    clearSearchInput();
    fetchImagesByCategory(currentCategory, currentPage);
});
document.getElementById('technology-btn').addEventListener('click', () => {
    currentCategory = 'technology';
    currentPage = 1;
    isSearchMode = false;
    clearSearchInput();
    fetchImagesByCategory(currentCategory, currentPage);
});
document.getElementById('people-btn').addEventListener('click', () => {
    currentCategory = 'people';
    currentPage = 1;
    isSearchMode = false;
    clearSearchInput();
    fetchImagesByCategory(currentCategory, currentPage);
});
document.getElementById('architecture-btn').addEventListener('click', () => {
    currentCategory = 'architecture';
    currentPage = 1;
    isSearchMode = false;
    clearSearchInput();
    fetchImagesByCategory(currentCategory, currentPage);
});



searchButton.addEventListener('click', () => {
    const query = searchQueryInput.value.trim();
    if (query) {
        currentSearchQuery = query;
        currentPage = 1;
        isSearchMode = true;
        fetchImages(currentSearchQuery, currentPage);
    }
});


function initializeSearch() {

    searchQueryInput.focus();

    searchQueryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            triggerSearch();
        }
    });

    searchButton.addEventListener('click', triggerSearch);
}


function triggerSearch() {
    const query = searchQueryInput.value.trim();
    if (query) {
        currentSearchQuery = query;
        currentPage = 1;
        isSearchMode = true;
        fetchImages(currentSearchQuery, currentPage);
    }
}

function updateSearchResultsText() {
    const resultsTextElement = document.getElementById('results-text');
    let searchText = 'results';

    if (isSearchMode) {
        searchText = `Here are images related to ${currentSearchQuery}:`;
    } else if (currentCategory) {
        searchText = `Here are images related to ${currentCategory}:`;
    }

    resultsTextElement.textContent = searchText;
}


async function fetchImagesByCategory(category, page) {
    const url = `https://api.unsplash.com/search/photos?query=${category}&page=${page}&per_page=12&client_id=${accessKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = Math.ceil(data.total / 12);
        renderImages(data.results);
        updatePagination();
        updateSearchResultsText();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}


async function fetchImages(query, page) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=${accessKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = Math.ceil(data.total / 12);
        renderImages(data.results);
        updatePagination();
        updateSearchResultsText();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}


function renderImages(images) {
    resultsContainer.innerHTML = '';
    images.forEach(image => {
        const imageCard = imageTemplate.content.cloneNode(true);
        const imgElement = imageCard.querySelector('img');
        const downloadButton = imageCard.querySelector('.download-btn');

        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Image';

        imgElement.addEventListener('click', () => openFullImage(image.urls.full));

        downloadButton.addEventListener('click', () => {
            downloadImage(image.urls.full);
        });

        resultsContainer.appendChild(imageCard);
    });
}


function updatePagination() {
    pageNumber.textContent = currentPage;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.style.display = 'block';
    nextButton.style.display = 'block';
    pageNumber.style.display = 'block';
}



prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        if (isSearchMode) {
            fetchImages(currentSearchQuery, currentPage);
        } else {
            fetchImagesByCategory(currentCategory, currentPage);
        }
    }
});


nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        if (isSearchMode) {
            fetchImages(currentSearchQuery, currentPage);
        } else {
            fetchImagesByCategory(currentCategory, currentPage);
        }
    }
});


async function downloadImage(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        const objectURL = URL.createObjectURL(blob);

        link.href = objectURL;
        link.download = 'image.jpg';
        link.click();

        URL.revokeObjectURL(objectURL);
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
}

function openFullImage(imageUrl) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <img src="${imageUrl}" alt="Full Image">
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    clearSearchInput();
});


const categoryButtons = document.querySelectorAll('.category-btn');

categoryButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        event.stopPropagation();

        if (this.classList.contains('active')) {
            this.classList.remove('active');
        } else {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        }
    });
});


document.addEventListener('click', function () {

    categoryButtons.forEach(btn => btn.classList.remove('active'));
});

function getAccessKey() {
    return 'n_Y5F7y83q1t-MAnLm7peBjTAyW9VFdjSoKltrM_s3Q';
}
const accessKey = getAccessKey()


function toggleMenu() {
    const links = document.querySelector('.navbar-links');
    links.classList.toggle('active');
}

function createFooter() {
    const footer = document.createElement('div');
    footer.id = 'footer';
    footer.style.position = 'fixed';
    footer.style.left = '0';
    footer.style.bottom = '0';
    footer.style.width = '100%';
    footer.style.backgroundColor = 'none';
    footer.style.color = '';
    footer.style.textAlign = 'center';
    footer.style.padding = '10px 0';
    footer.style.fontSize = '14px';
    footer.style.transition = 'bottom 0.3s ease, opacity 0.3s ease';
    footer.style.opacity = '1';
    footer.innerHTML = '© 2025 Imagio -The Image Search Engine. All rights reserved.';
    document.body.appendChild(footer);
}

function hideFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.bottom = '-100px';
        footer.style.opacity = '0';
    }
}


function showFooterOnScroll() {
    const footer = document.getElementById('footer');
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    if (scrollPosition + windowHeight >= documentHeight - 1) {
        footer.style.bottom = '0';
        footer.style.opacity = '1';
    } else {
        footer.style.bottom = '-100px';
        footer.style.opacity = '0';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    createFooter();

    loadImagesAndHideFooter();
});


window.addEventListener('scroll', showFooterOnScroll);

function loadImagesAndHideFooter() {
    hideFooter();
}


function renderImages(images) {
    resultsContainer.innerHTML = '';
    images.forEach(image => {
        const imageCard = imageTemplate.content.cloneNode(true);
        const imgElement = imageCard.querySelector('img');
        const downloadButton = imageCard.querySelector('.download-btn');

        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Image';

        imgElement.addEventListener('click', () => openFullImage(image.urls.full));

        downloadButton.addEventListener('click', () => {
            downloadImage(image.urls.full);
        });

        imgElement.onload = () => {
            updatePagination();
        };

        resultsContainer.appendChild(imageCard);
    });

    if (images.length > 0) {
        updatePagination();
    }
}
