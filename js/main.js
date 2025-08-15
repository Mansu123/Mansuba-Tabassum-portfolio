// ===== GLOBAL VARIABLES =====
let isScrolling = false;

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// ===== DOM LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Initialize all functions
    initPreloader();
    initNavigation();
    initScrollProgress();
    initBackToTop();
    initTypingEffect();
    initContactForm();
    initSmoothScrolling();
    initScrollSpy();
    initAnimations();
    
    // Remove preloader after everything is loaded
    setTimeout(() => {
        hidePreloader();
    }, 1000);
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '1';
    }
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Navbar scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    function closeMobileMenu() {
        if (hamburger && mobileMenu) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    
    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }, 50);
    
    window.addEventListener('scroll', updateProgress);
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        const toggleBackToTop = throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, 100);
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    
    if (typingElement) {
        const texts = [
            'Machine Learning Engineer',
            'AI Research Fellow',
            'Deep Learning Specialist',
            'Computer Vision Expert',
            'NLP Enthusiast',
            'Data Scientist'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeEffect() {
            const currentText = texts[textIndex];
            
            if (!isDeleting && charIndex < currentText.length) {
                // Typing
                typingElement.textContent = currentText.slice(0, charIndex + 1);
                charIndex++;
                setTimeout(typeEffect, 100);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                typingElement.textContent = currentText.slice(0, charIndex - 1);
                charIndex--;
                setTimeout(typeEffect, 50);
            } else if (!isDeleting && charIndex === currentText.length) {
                // Pause before deleting
                if (!isPaused) {
                    isPaused = true;
                    setTimeout(() => {
                        isDeleting = true;
                        isPaused = false;
                        typeEffect();
                    }, 2000);
                }
            } else if (isDeleting && charIndex === 0) {
                // Move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeEffect, 500);
            }
        }
        
        // Start typing effect after a delay
        setTimeout(typeEffect, 1000);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearError);
        });
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate form submission (replace with actual form handler)
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            showError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!data.subject || data.subject.trim().length < 3) {
            showError('subject', 'Subject must be at least 3 characters long');
            isValid = false;
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            showError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        clearError(e);
        
        switch (input.name) {
            case 'name':
                if (value.length > 0 && value.length < 2) {
                    showError('name', 'Name must be at least 2 characters long');
                }
                break;
            case 'email':
                if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError('email', 'Please enter a valid email address');
                }
                break;
            case 'subject':
                if (value.length > 0 && value.length < 3) {
                    showError('subject', 'Subject must be at least 3 characters long');
                }
                break;
            case 'message':
                if (value.length > 0 && value.length < 10) {
                    showError('message', 'Message must be at least 10 characters long');
                }
                break;
        }
    }
    
    function showError(fieldName, message) {
        const input = document.getElementById(fieldName);
        if (input) {
            input.style.borderColor = '#e53e3e';
            
            // Remove existing error message
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#e53e3e';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.25rem';
            input.parentNode.appendChild(errorDiv);
        }
    }
    
    function clearError(e) {
        const input = e.target;
        input.style.borderColor = '';
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL SPY =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const updateActiveLink = throttle(() => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);
    
    window.addEventListener('scroll', updateActiveLink);
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Animate on scroll
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
    const animateElements = document.querySelectorAll('.card, .project-card, .timeline-item, .achievement-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Counter animation
    animateCounters();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace('+', ''));
        const duration = 2000;
        const increment = target / (duration / 50);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
        }, 50);
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual remove
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    function removeNotification(element) {
        element.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#48bb78',
        error: '#e53e3e',
        warning: '#ed8936',
        info: '#4299e1'
    };
    return colors[type] || colors.info;
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// ===== THEME TOGGLE (Optional) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
    }
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScrollEffects() {
        // Batch scroll-based updates here
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== INITIALIZE ON LOAD =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    optimizePerformance();
    initLazyLoading();
    // Add other initialization functions as needed
}