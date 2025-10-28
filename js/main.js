// VitalWealth Main JavaScript

// Pagination settings
let currentPage = 1;
const articlesPerPage = 6;
let filteredArticles = [...articlesData];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNav();
    initializeSearch();
    handleURLSearch(); // Handle search from URL parameters
    displayArticles();
    setupAnimations();
});

// Navigation Functions
function initializeNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav');
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate hamburger
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

    // Dropdown for mobile
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
        });
    }
}

// Handle URL search parameter
function handleURLSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        const searchInput = document.getElementById('searchInput');
        const searchBar = document.getElementById('searchBar');
        
        if (searchInput && searchBar) {
            // Show search bar and set value
            searchBar.classList.add('active');
            searchInput.value = searchTerm;
            
            // Perform search
            const term = searchTerm.toLowerCase();
            filteredArticles = articlesData.filter(article => {
                return article.title.toLowerCase().includes(term) ||
                       article.excerpt.toLowerCase().includes(term) ||
                       article.categoryName.toLowerCase().includes(term);
            });
            
            currentPage = 1;
        }
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                filteredArticles = [...articlesData];
            } else {
                filteredArticles = articlesData.filter(article => {
                    return article.title.toLowerCase().includes(searchTerm) ||
                           article.excerpt.toLowerCase().includes(searchTerm) ||
                           article.categoryName.toLowerCase().includes(searchTerm);
                });
            }
            
            currentPage = 1;
            displayArticles();
        });
    }
}

// Display articles with pagination
function displayArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    if (articlesToShow.length === 0) {
        articlesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 4rem 0; color: var(--text-secondary);">No articles found.</p>';
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
    
    // Previous button
    paginationHTML += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next button
    paginationHTML += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    
    paginationElement.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayArticles();
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll animations
function setupAnimations() {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#categories') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

