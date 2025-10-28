// VitalWealth Article Page JavaScript

let currentArticle = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    initializeNav();
    initializeSearch();
    loadArticle(articleId);
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
        });
    }
}

// Search functionality - redirect to home with search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value;
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

// Load article content
function loadArticle(articleId) {
    currentArticle = articlesData.find(article => article.id === articleId);
    
    if (!currentArticle) {
        document.querySelector('.article-detail').innerHTML = `
            <div class="container-narrow" style="text-align: center; padding: 4rem 0;">
                <h1>Article Not Found</h1>
                <p>Sorry, we couldn't find the article you're looking for.</p>
                <a href="index.html" style="display: inline-block; margin-top: 2rem; padding: 1rem 2rem; background: var(--primary-color); color: white;">Return Home</a>
            </div>
        `;
        return;
    }
    
    // Update page title
    document.title = `${currentArticle.title} - VitalWealth`;
    
    // Update article meta
    document.getElementById('articleCategory').textContent = currentArticle.categoryName;
    document.getElementById('articleDate').textContent = currentArticle.date;
    document.getElementById('articleTitle').textContent = currentArticle.title;
    
    // Update main image
    const mainImage = document.getElementById('articleMainImage');
    mainImage.src = currentArticle.image;
    mainImage.alt = currentArticle.title;
    
    // Update content
    document.getElementById('articleContent').innerHTML = currentArticle.content;
    
    // Display related products
    displayProducts();
    
    // Add smooth scroll animation
    setTimeout(() => {
        const articleDetail = document.querySelector('.article-detail');
        articleDetail.style.opacity = '0';
        articleDetail.style.transform = 'translateY(20px)';
        articleDetail.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            articleDetail.style.opacity = '1';
            articleDetail.style.transform = 'translateY(0)';
        }, 100);
    }, 0);
}

// Display related products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!currentArticle.products || currentArticle.products.length === 0) {
        document.getElementById('relatedProducts').style.display = 'none';
        return;
    }
    
    productsGrid.innerHTML = currentArticle.products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="product-price">${product.price}</p>
            <p class="product-description">${product.description}</p>
            <a href="${product.link}" class="product-link" target="_blank">View Product</a>
        </div>
    `).join('');
    
    // Animate products on scroll
    const productCards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

