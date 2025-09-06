// Responsive Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .learning-card, .stat-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Form handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Por favor, ingresa un email válido');
                return;
            }
            
            // Simulate form submission
            alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Responsive card heights adjustment
    function adjustCardHeights() {
        if (window.innerWidth >= 768) {
            const cardGroups = [
                document.querySelectorAll('.feature-card'),
                document.querySelectorAll('.learning-card')
            ];

            cardGroups.forEach(cards => {
                let maxHeight = 0;
                
                // Reset heights
                cards.forEach(card => {
                    card.style.height = 'auto';
                });
                
                // Find max height
                cards.forEach(card => {
                    const height = card.offsetHeight;
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });
                
                // Apply max height to all cards
                cards.forEach(card => {
                    card.style.height = maxHeight + 'px';
                });
            });
        } else {
            // Reset heights on mobile
            document.querySelectorAll('.feature-card, .learning-card').forEach(card => {
                card.style.height = 'auto';
            });
        }
    }

    // Adjust card heights on load and resize
    adjustCardHeights();
    window.addEventListener('resize', debounce(adjustCardHeights, 250));

    // Handle device orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustCardHeights, 500);
    });

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && navMenu && navMenu.classList.contains('active')) {
                // Swipe right - close menu
                if (navToggle) navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    }

    // Accessibility improvements
    function enhanceAccessibility() {
        // Enhance keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });

            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
        });

        // Add ARIA labels where needed
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'navigation-menu');
        }

        if (navMenu) {
            navMenu.id = 'navigation-menu';
        }
    }

    enhanceAccessibility();

    // Update ARIA states for mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    console.log('🚀 Nodo Codo a Codo - Responsive features loaded successfully!');
});
