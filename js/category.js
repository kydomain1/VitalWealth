// VitalWealth Category Page JavaScript

let currentPage = 1;
const articlesPerPage = 6;
let currentCategory = '';
let filteredArticles = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('cat') || '';
    
    initializeNav();
    initializeSearch();
    updateCategoryInfo();
    filterArticlesByCategory();
    displayArticles();
});

// Navigation (same as main.js)
function initializeNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav');
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    // Search toggle - redirect to search page
    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            window.location.href = 'search.html';
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchBar.classList.remove('active');
            document.getElementById('searchInput').value = '';
            filterArticlesByCategory();
        });
    }
}

// Update category header
function updateCategoryInfo() {
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    if (currentCategory && categories[currentCategory]) {
        const cat = categories[currentCategory];
        categoryTitle.textContent = cat.name;
        categoryDescription.textContent = cat.description;
        document.title = `${cat.name} - VitalWealth`;
    } else {
        categoryTitle.textContent = 'All Articles';
        categoryDescription.textContent = 'Explore our curated collection of lifestyle articles';
    }
}

// Filter articles by category
function filterArticlesByCategory() {
    if (currentCategory) {
        filteredArticles = articlesData.filter(article => article.category === currentCategory);
    } else {
        filteredArticles = [...articlesData];
    }
    currentPage = 1;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            filterArticlesByCategory();
            
            if (searchTerm !== '') {
                filteredArticles = filteredArticles.filter(article => {
                    return article.title.toLowerCase().includes(searchTerm) ||
                           article.excerpt.toLowerCase().includes(searchTerm);
                });
            }
            
            currentPage = 1;
            displayArticles();
        });
    }
}

// Display articles
function displayArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    if (articlesToShow.length === 0) {
        articlesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 4rem 0; color: var(--text-secondary);">No articles found in this category.</p>';
        return;
    }

    articlesGrid.innerHTML = articlesToShow.map(article => `
        <a href="article.html?id=${article.id}" class="article-card">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="article-info">
                <div class="article-meta">
                    <span class="category">${article.categoryName}</span>
                    <span class="date">${article.date}</span>
                </div>
                <h3>${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <span class="read-more">Read More →</span>
            </div>
        </a>
    `).join('');

    displayPagination();
}

// Pagination
function displayPagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    paginationHTML += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    paginationHTML += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    
    paginationElement.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

