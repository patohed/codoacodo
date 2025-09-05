// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
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

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('.feature-card, .area-card, .audience-card, .testimonial-card, .step');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // Contact form handling with enhanced security
    const contactForm = document.getElementById('contactForm');
    
    // Security utilities
    const SecurityUtils = {
        // XSS Protection - HTML sanitization
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },
        
        // Input validation patterns
        patterns: {
            name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: /^[\s\S]{0,1000}$/
        },
        
        // Rate limiting
        lastSubmission: 0,
        minInterval: 5000, // 5 seconds between submissions
        
        checkRateLimit: function() {
            const now = Date.now();
            if (now - this.lastSubmission < this.minInterval) {
                return false;
            }
            this.lastSubmission = now;
            return true;
        },
        
        // Honeypot check
        checkHoneypot: function(formData) {
            return !formData.get('website'); // Should be empty
        }
    };
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Rate limiting check
        if (!SecurityUtils.checkRateLimit()) {
            showNotification('Por favor esperá unos segundos antes de enviar otro mensaje', 'warning');
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        
        // Honeypot spam protection
        if (!SecurityUtils.checkHoneypot(formData)) {
            console.warn('Spam attempt detected');
            return; // Silent fail for bots
        }
        
        // Get and sanitize inputs
        const name = SecurityUtils.sanitizeHTML(formData.get('name')?.trim() || '');
        const email = SecurityUtils.sanitizeHTML(formData.get('email')?.trim() || '');
        const interest = SecurityUtils.sanitizeHTML(formData.get('interest') || '');
        const message = SecurityUtils.sanitizeHTML(formData.get('message')?.trim() || '');
        
        // Enhanced validation
        const validationErrors = [];
        
        if (!name || !SecurityUtils.patterns.name.test(name)) {
            validationErrors.push('El nombre debe tener entre 2 y 100 caracteres y solo contener letras y espacios');
        }
        
        if (!email || !SecurityUtils.patterns.email.test(email)) {
            validationErrors.push('Por favor ingresá un email válido');
        }
        
        if (!interest) {
            validationErrors.push('Por favor seleccioná una opción de participación');
        }
        
        if (message && !SecurityUtils.patterns.message.test(message)) {
            validationErrors.push('El mensaje no puede superar los 1000 caracteres');
        }
        
        // Show validation errors
        if (validationErrors.length > 0) {
            showNotification(validationErrors[0], 'error');
            return;
        }
        
        // Additional security checks
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];
        
        const allInputs = [name, email, message].join(' ');
        if (suspiciousPatterns.some(pattern => pattern.test(allInputs))) {
            console.warn('Potential XSS attempt detected');
            showNotification('Por favor revisá tu mensaje e intentá nuevamente', 'error');
            return;
        }
        
        // Simulate secure form submission
        const submitButton = this.querySelector('#submitBtn');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitButton.disabled = true;
        
        // Simulate API call with security headers
        setTimeout(() => {
            showNotification('¡Gracias por tu interés! Te contactaremos pronto.', 'success');
            this.reset();
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitButton.disabled = false;
        }, 2000);
    });

    // Notification system (enhanced)
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Security indicator (remove in production)
    setTimeout(() => {
        const indicator = document.getElementById('securityIndicator');
        if (indicator && window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 2000);
            }, 5000);
        } else {
            indicator?.remove();
        }
    }, 2000);

    // Floating cards animation enhancement with click focus effect
    const floatingCards = document.querySelectorAll('.card-float');
    const floatingCardsContainer = document.querySelector('.floating-cards');
    let focusTimeout;
    
    floatingCards.forEach((card, index) => {
        // Store original position for restoration
        const computedStyle = window.getComputedStyle(card);
        card.originalPosition = {
            top: card.style.top || computedStyle.top,
            left: card.style.left || computedStyle.left,
            right: card.style.right || computedStyle.right,
            bottom: card.style.bottom || computedStyle.bottom,
            transform: card.style.transform || computedStyle.transform
        };
        
        // Subtle hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(255, 255, 255, 0.25)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('focused')) {
                this.style.transform = '';
                this.style.background = '';
                this.style.borderColor = '';
            }
        });
        
        // Click effect for centering
        card.addEventListener('click', function() {
            if (floatingCardsContainer.classList.contains('focus-mode') && this.classList.contains('focused')) {
                // Si ya está enfocada, la desenfocar
                floatingCardsContainer.classList.remove('focus-mode');
                floatingCards.forEach(c => {
                    c.classList.remove('focused');
                    c.style.transform = '';
                    c.style.background = '';
                    c.style.borderColor = '';
                });
            } else {
                // Enfocar esta tarjeta
                floatingCardsContainer.classList.add('focus-mode');
                floatingCards.forEach(c => c.classList.remove('focused'));
                this.classList.add('focused');
            }
        });
    });
    
    // Close focus mode when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.floating-cards')) {
            floatingCardsContainer.classList.remove('focus-mode');
            floatingCards.forEach(c => {
                c.classList.remove('focused');
                c.style.transform = '';
                c.style.background = '';
                c.style.borderColor = '';
            });
        }
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Counter animation for statistics (if we add them later)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Mobile menu toggle (for future mobile menu implementation)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const navMenu = document.querySelector('.nav-menu');
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #333;
            cursor: pointer;
        `;
        
        nav.appendChild(hamburger);
        
        // Show hamburger on mobile
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleScreenChange = (e) => {
            if (e.matches) {
                hamburger.style.display = 'block';
                navMenu.style.display = 'none';
            } else {
                hamburger.style.display = 'none';
                navMenu.style.display = 'flex';
            }
        };
        
        mediaQuery.addListener(handleScreenChange);
        handleScreenChange(mediaQuery);
        
        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                navMenu.style.cssText += `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                `;
            }
        });
    };
    
    createMobileMenu();

    // Add loading states and micro-interactions
    const addLoadingStates = () => {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.feature-card, .area-card, .audience-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    };
    
    addLoadingStates();

    // Console welcome message
    console.log(`
    🟪 ¡Bienvenido a Nodo Codo a Codo! 🟪
    
    Un proyecto comunitario donde la tecnología se vuelve accesible.
    
    🤖 REVOLUCIÓN: Aprendé a trabajar "codo a codo" con IA
    
    Nuestras áreas de formación:
    🖥️  Computadoras y tecnología básica
    📱 Celulares y dispositivos móviles  
    💡 Tecnología aplicada a la vida
    📈 Marketing Digital
    📱 Creación de Contenido para redes
    🔒 Ciberseguridad
    🤖 IA como Compañera de Aprendizaje ¡NUEVO!
    💻 Programación y áreas avanzadas
    
    🚀 Si estás viendo esto, ¡ya tenés curiosidad tecnológica!
    💻 ¿Te interesa colaborar con el código? ¡Escribinos!
    🤝 Así como yo (Copilot) te ayudo aquí, vas a aprender a trabajar
       con ChatGPT, Claude y otros asistentes para potenciar tu aprendizaje.
    
    Tecnología accesible. Aprendizaje real. Humanos + IA. Juntos.
    `);
});
