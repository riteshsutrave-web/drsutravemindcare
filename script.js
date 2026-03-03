// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNav();
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    initWaitingArea();
    initScrollEffects();
    initContactForm();
    initScrollToTop();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAppointmentSubmission(this);
        });
    }
}

// Handle Appointment Form Submission
function handleAppointmentSubmission(form) {
    const formData = new FormData(form);
    const appointmentData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message')
    };

    // Validate form data
    if (validateAppointmentForm(appointmentData)) {
        // Create WhatsApp message
        const whatsappMessage = createAppointmentWhatsAppMessage(appointmentData);
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/919071020350?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showNotification('Opening WhatsApp to send your appointment request!', 'success');
        
        // Reset form
        form.reset();
        
        console.log('Appointment Data:', appointmentData);
    }
}

// Validate Appointment Form
function validateAppointmentForm(data) {
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid 10-digit phone number.', 'error');
        return false;
    }
    
    // Validate email if provided
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }
    }
    
    // Validate date (should not be in the past)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date for your appointment.', 'error');
        return false;
    }
    
    return true;
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }
}

// Handle Contact Form Submission
function handleContactSubmission(form) {
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        phone: formData.get('contactPhone'),
        message: formData.get('contactMessage')
    };

    // Validate contact form
    if (validateContactForm(contactData)) {
        // Create WhatsApp message
        const whatsappMessage = createContactWhatsAppMessage(contactData);
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/919071020350?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showNotification('Opening WhatsApp to send your message!', 'success');
        form.reset();
        console.log('Contact Data:', contactData);
    }
}

// Validate Contact Form
function validateContactForm(data) {
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

// Create WhatsApp Message for Appointment
function createAppointmentWhatsAppMessage(data) {
    const serviceNames = {
        'opd': 'OPD Consultation',
        'ipd': 'IPD Treatment',
        'm-ect': 'M-ECT',
        'counselling': 'Counselling & Psychotherapy',
        'de-addiction': 'De-Addiction Treatment',
        'sexual-problems': 'Sexual Problems Treatment'
    };
    
    const serviceName = serviceNames[data.service] || data.service;
    const formattedDate = new Date(data.date).toLocaleDateString('en-IN');
    
    return `🏥 *APPOINTMENT REQUEST - Mind Care Clinic*

👤 *Patient Name:* ${data.name}
📞 *Phone:* ${data.phone}
${data.email ? `📧 *Email:* ${data.email}\n` : ''}
🏥 *Service Required:* ${serviceName}
📅 *Preferred Date:* ${formattedDate}
⏰ *Preferred Time:* ${data.time}
${data.message ? `💬 *Additional Information:* ${data.message}\n` : ''}

*Please confirm my appointment request.*

Thank you! 🙏`;
}

// Create WhatsApp Message for Contact
function createContactWhatsAppMessage(data) {
    return `💬 *CONTACT MESSAGE - Mind Care Clinic*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
${data.phone ? `📞 *Phone:* ${data.phone}\n` : ''}
💬 *Message:* ${data.message}

*Please respond to my inquiry.*

Thank you! 🙏`;
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#f97316' : type === 'error' ? '#f44336' : '#1e3a8a'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Initialize Animations
function initAnimations() {
    // Add loading animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('loading');
    });
    
    // Trigger animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize Waiting Area
function initWaitingArea() {
    // Simulate real-time updates for waiting area
    const currentPatient = document.getElementById('currentPatient');
    const nextPatient = document.getElementById('nextPatient');
    const waitTime = document.getElementById('waitTime');
    
    if (currentPatient && nextPatient && waitTime) {
        // Update waiting area every 30 seconds
        setInterval(() => {
            updateWaitingStatus();
        }, 30000);
        
        // Initial update
        updateWaitingStatus();
    }
}

// Update Waiting Status
function updateWaitingStatus() {
    const patients = [
        'Patient #001 - Rahul Sharma',
        'Patient #002 - Priya Patel',
        'Patient #003 - Vikram Singh',
        'Patient #004 - Anjali Desai',
        'Patient #005 - Rajesh Kumar'
    ];
    
    const waitTimes = [
        '5 minutes',
        '10 minutes',
        '15 minutes',
        '20 minutes',
        '25 minutes'
    ];
    
    const currentIndex = Math.floor(Math.random() * patients.length);
    const nextIndex = (currentIndex + 1) % patients.length;
    const waitIndex = Math.floor(Math.random() * waitTimes.length);
    
    const currentPatient = document.getElementById('currentPatient');
    const nextPatient = document.getElementById('nextPatient');
    const waitTime = document.getElementById('waitTime');
    
    if (currentPatient) currentPatient.textContent = patients[currentIndex];
    if (nextPatient) nextPatient.textContent = patients[nextIndex];
    if (waitTime) waitTime.textContent = waitTimes[waitIndex];
}

// Initialize Scroll Effects
function initScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Add CSS for notifications and active states
const additionalStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .nav-link.active {
        color: #1e3a8a;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .service-card:hover .service-icon {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .testimonial-card:hover {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
    
    .gallery-item:hover .gallery-placeholder {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Utility Functions
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add click-to-call functionality
document.addEventListener('DOMContentLoaded', function() {
    const phoneNumbers = document.querySelectorAll('a[href^="tel:"], .phone-number');
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function(e) {
            e.preventDefault();
            const number = this.textContent.replace(/\D/g, '');
            if (confirm(`Call ${formatPhoneNumber(number)}?`)) {
                window.location.href = `tel:${number}`;
            }
        });
    });
    
    // Add WhatsApp functionality
    const whatsappNumbers = document.querySelectorAll('.whatsapp-number');
    whatsappNumbers.forEach(whatsapp => {
        whatsapp.addEventListener('click', function(e) {
            e.preventDefault();
            const number = this.textContent.replace(/\D/g, '');
            const message = encodeURIComponent('Hello, I would like to book an appointment.');
            window.open(`https://wa.me/${number}?text=${message}`, '_blank');
        });
    });
});

// Add loading animation for images (if any are added later)
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add analytics tracking (example - replace with actual analytics)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Add your analytics code here (Google Analytics, etc.)
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            trackEvent('form_submission', {
                form_id: this.id,
                form_action: this.action
            });
        });
    });
    
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('button_click', {
                button_text: this.textContent,
                button_class: this.className
            });
        });
    });
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent);
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #1e3a8a';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// Performance optimization - lazy loading for sections
function lazyLoadSections() {
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadSections);

// Scroll to Top Functionality
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
