// VitalWealth Search Page JavaScript

let currentFilter = 'all';
let searchResults = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNav();
    initializeSearchPage();
    handleURLSearch();
    displayPopularArticles();
});

// Navigation Functions
function initializeNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav');

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
}

// Initialize Search Page
function initializeSearchPage() {
    const searchInput = document.getElementById('searchPageInput');
    const clearBtn = document.getElementById('clearSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });

        // Clear button
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                performSearch('');
            });
        }
    }

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentFilter = this.dataset.category;
            
            // Re-run search with current input
            const searchTerm = searchInput.value;
            performSearch(searchTerm);
        });
    });
}

// Handle URL search parameter
function handleURLSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q') || urlParams.get('search');
    
    if (searchTerm) {
        const searchInput = document.getElementById('searchPageInput');
        if (searchInput) {
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        }
    }
}

// Perform search
function performSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    // Filter articles
    if (term === '') {
        searchResults = currentFilter === 'all' 
            ? [...articlesData] 
            : articlesData.filter(article => article.category === currentFilter);
    } else {
        searchResults = articlesData.filter(article => {
            const matchesSearch = 
                article.title.toLowerCase().includes(term) ||
                article.excerpt.toLowerCase().includes(term) ||
                article.categoryName.toLowerCase().includes(term) ||
                article.content.toLowerCase().includes(term);
            
            const matchesFilter = currentFilter === 'all' || article.category === currentFilter;
            
            return matchesSearch && matchesFilter;
        });
    }
    
    // Display results
    displaySearchResults(term);
    updateSearchStats(term);
}

// Display search results
function displaySearchResults(searchTerm) {
    const resultsGrid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResults');
    const popularSection = document.getElementById('popularSection');
    
    if (searchResults.length === 0) {
        resultsGrid.innerHTML = '';
        noResults.style.display = 'block';
        popularSection.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Show popular section if no search term
    if (searchTerm === '' && currentFilter === 'all') {
        popularSection.style.display = 'block';
        resultsGrid.innerHTML = '';
        return;
    } else {
        popularSection.style.display = 'none';
    }
    
    // Display results
    resultsGrid.innerHTML = searchResults.map((article, index) => `
        <a href="article.html?id=${article.id}" class="article-card" style="animation-delay: ${index * 0.1}s">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="article-info">
                <div class="article-meta">
                    <span class="category">${article.categoryName}</span>
                    <span class="date">${article.date}</span>
                </div>
                <h3>${highlightSearchTerm(article.title, searchTerm)}</h3>
                <p class="article-excerpt">${highlightSearchTerm(article.excerpt, searchTerm)}</p>
                <span class="read-more">Read More →</span>
            </div>
        </a>
    `).join('');
}

// Highlight search term in results
function highlightSearchTerm(text, term) {
    if (!term || term === '') return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Update search stats
function updateSearchStats(searchTerm) {
    const statsElement = document.getElementById('searchStats');
    
    if (searchTerm === '' && currentFilter === 'all') {
        statsElement.innerHTML = '<p>Enter a search term to find articles</p>';
        return;
    }
    
    const filterText = currentFilter === 'all' ? 'all categories' : categories[currentFilter].name;
    
    if (searchTerm === '') {
        statsElement.innerHTML = `<p>Showing <strong>${searchResults.length}</strong> articles in <strong>${filterText}</strong></p>`;
    } else {
        statsElement.innerHTML = `
            <p>Found <strong>${searchResults.length}</strong> result${searchResults.length !== 1 ? 's' : ''} 
            for "<strong>${searchTerm}</strong>" in <strong>${filterText}</strong></p>
        `;
    }
}

// Display popular articles
function displayPopularArticles() {
    const popularGrid = document.getElementById('popularArticles');
    
    if (!popularGrid) return;
    
    // Show all articles as popular
    popularGrid.innerHTML = articlesData.map((article, index) => `
        <a href="article.html?id=${article.id}" class="article-card" style="animation-delay: ${index * 0.1}s">
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
}

// Suggestion tags click handler
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-tag')) {
        e.preventDefault();
        const searchTerm = e.target.textContent;
        const searchInput = document.getElementById('searchPageInput');
        if (searchInput) {
            searchInput.value = searchTerm;
            performSearch(searchTerm);
            searchInput.focus();
        }
    }
});


