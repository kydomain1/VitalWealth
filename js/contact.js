// VitalWealth Contact Page JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNav();
    initializeContactForm();
});

// Navigation and search functionality
function initializeNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav');
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    // Mobile menu toggle
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

    // Search close
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchBar.classList.remove('active');
            searchInput.value = '';
        });
    }

    // Search functionality - redirect to home with search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value;
                if (searchTerm.trim()) {
                    window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate form (basic validation)
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            // In a real application, this would send data to a server
            console.log('Form submitted:', { name, email, subject, message });
            
            // Hide form and show success message with animation
            contactForm.style.opacity = '0';
            contactForm.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
                formSuccess.style.opacity = '0';
                formSuccess.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    formSuccess.style.transition = 'all 0.6s ease';
                    formSuccess.style.opacity = '1';
                    formSuccess.style.transform = 'translateY(0)';
                }, 100);
            }, 300);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Add focus animations to form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('label').style.color = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('label').style.color = '';
        });
    });
}

// Smooth animations for page elements
window.addEventListener('load', function() {
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
        contactGrid.style.opacity = '0';
        contactGrid.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contactGrid.style.transition = 'all 0.8s ease';
            contactGrid.style.opacity = '1';
            contactGrid.style.transform = 'translateY(0)';
        }, 200);
    }
});

