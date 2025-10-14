// ===== GLOBAL VARIABLES =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

// ===== THEME TOGGLE =====
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Update logos based on theme
    this.updateLogos(theme);
  }

  updateLogos(theme) {
    const navLogo = document.getElementById('nav-logo');
    const footerLogo = document.getElementById('footer-logo');
    
    if (navLogo && footerLogo) {
      const logoSrc = theme === 'dark' ? 'logo-dark.svg' : 'logo.svg';
      navLogo.src = logoSrc;
      footerLogo.src = logoSrc;
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  bindEvents() {
    themeToggle.addEventListener('click', () => this.toggleTheme());
  }
}

// ===== NAVIGATION =====
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => this.openMenu());
    navClose.addEventListener('click', () => this.closeMenu());
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Handle scroll events
    window.addEventListener('scroll', () => this.handleScroll());
  }

  openMenu() {
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class to header
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveLink();
    
    // Show/hide back to top button
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  }
}

// ===== BACK TO TOP =====
class BackToTop {
  constructor() {
    this.init();
  }

  init() {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ===== PRODUCT FILTER =====
class ProductFilter {
  constructor() {
    this.init();
  }

  init() {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => this.filterProducts(btn));
    });
  }

  filterProducts(activeBtn) {
    const category = activeBtn.getAttribute('data-category');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    // Filter products
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// ===== CONTACT FORM =====
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupFormValidation();
  }

  setupFormValidation() {
    const inputs = contactForm.querySelectorAll('.form__input');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    this.clearError(field);

    // Validation rules
    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Por favor ingrese un email válido';
        }
        break;
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Por favor ingrese un teléfono válido';
        }
        break;
      case 'subject':
        if (!value) {
          isValid = false;
          errorMessage = 'Por favor seleccione un asunto';
        }
        break;
      case 'message':
        if (value.length < 10) {
          isValid = false;
          errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        }
        break;
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }

  clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('.form__input');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showNotification('Por favor corrija los errores en el formulario', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateSubmission(data);
      
      this.showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
      contactForm.reset();
      
    } catch (error) {
      this.showNotification('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
    } finally {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async simulateSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          resolve(data);
        } else {
          reject(new Error('Simulated error'));
        }
      }, 2000);
    });
  }

  showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification__close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => this.hideNotification(notification), 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => this.hideNotification(notification));
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }
}

// ===== ANIMATIONS =====
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupCounterAnimations();
  }

  setupIntersectionObserver() {
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
    const animateElements = document.querySelectorAll(
      '.service-card, .product-card, .feature, .stat, .contact__item'
    );
    
    animateElements.forEach(el => observer.observe(el));
  }

  setupCounterAnimations() {
    const stats = document.querySelectorAll('.stat__number');
    
    const animateCounter = (element) => {
      const target = parseInt(element.textContent.replace(/\D/g, ''));
      const suffix = element.textContent.replace(/\d/g, '');
      let current = 0;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
      }, 30);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    });

    stats.forEach(stat => statsObserver.observe(stat));
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  preloadCriticalResources() {
    // Preload critical CSS and JS
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      document.head.appendChild(link);
    });
  }
}

// ===== PWA FUNCTIONALITY =====
class PWAManager {
  constructor() {
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button or banner
      this.showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallBanner();
    });
  }

  showInstallBanner() {
    // Create install banner
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner__content">
        <i class="fas fa-download"></i>
        <span>Instala Galenus Panamá en tu dispositivo</span>
        <button class="install-banner__btn">Instalar</button>
        <button class="install-banner__close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    const installBtn = banner.querySelector('.install-banner__btn');
    const closeBtn = banner.querySelector('.install-banner__close');
    
    installBtn.addEventListener('click', () => this.installApp());
    closeBtn.addEventListener('click', () => this.hideInstallBanner());
  }

  hideInstallBanner() {
    const banner = document.querySelector('.install-banner');
    if (banner) {
      banner.remove();
    }
  }

  async installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    }
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  }

  setupKeyboardNavigation() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll(
      '.service-card, .product-card, .category-btn'
    );
    
    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  setupFocusManagement() {
    // Manage focus for modal-like elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.focus();
        }
      }
    });
  }

  setupScreenReaderSupport() {
    // Add ARIA labels and descriptions
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const heading = section.querySelector('h2, h3');
      if (heading) {
        section.setAttribute('aria-labelledby', heading.id || heading.textContent);
      }
    });
  }
}

// ===== WHATSAPP INTEGRATION =====
class WhatsAppManager {
  constructor() {
    this.whatsappButton = document.getElementById('whatsapp-button');
    this.whatsappFloat = document.getElementById('whatsapp-float');
    this.whatsappTooltip = document.getElementById('whatsapp-tooltip');
    
    // WhatsApp configuration
    this.whatsappNumber = '+5073914481'; // Número principal de Galenus Panamá
    this.defaultMessage = 'Hola! Me gustaría obtener más información sobre los servicios de Galenus Panamá.';
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupTooltip();
  }

  bindEvents() {
    if (this.whatsappButton) {
      this.whatsappButton.addEventListener('click', () => this.openWhatsApp());
      
      // Add keyboard support
      this.whatsappButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openWhatsApp();
        }
      });
    }
  }

  setupTooltip() {
    if (this.whatsappTooltip) {
      // Show tooltip on hover with delay
      let showTimeout;
      let hideTimeout;

      this.whatsappFloat.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(() => {
          this.whatsappTooltip.style.opacity = '1';
          this.whatsappTooltip.style.visibility = 'visible';
          this.whatsappTooltip.style.transform = 'translateX(-50%) translateY(-5px)';
        }, 500);
      });

      this.whatsappFloat.addEventListener('mouseleave', () => {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => {
          this.whatsappTooltip.style.opacity = '0';
          this.whatsappTooltip.style.visibility = 'hidden';
          this.whatsappTooltip.style.transform = 'translateX(-50%)';
        }, 200);
      });
    }
  }

  openWhatsApp() {
    // Get current page information for context
    const currentPage = this.getCurrentPageContext();
    const message = this.buildWhatsAppMessage(currentPage);
    
    // Create WhatsApp URL
    const whatsappUrl = this.buildWhatsAppUrl(message);
    
    // Open WhatsApp
    this.openWhatsAppWindow(whatsappUrl);
    
    // Track the interaction (for analytics if needed)
    this.trackWhatsAppClick(currentPage);
  }

  getCurrentPageContext() {
    const currentSection = this.getCurrentSection();
    const pageTitle = document.title;
    
    return {
      section: currentSection,
      title: pageTitle,
      url: window.location.href
    };
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    for (let section of sections) {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        return section.getAttribute('id');
      }
    }
    
    return 'home';
  }

  buildWhatsAppMessage(context) {
    let message = this.defaultMessage;
    
    // Customize message based on current section
    switch (context.section) {
      case 'services':
        message = 'Hola! Me interesa conocer más sobre los servicios farmacéuticos de Galenus Panamá.';
        break;
      case 'products':
        message = 'Hola! Quisiera información sobre los medicamentos y productos disponibles en Galenus Panamá.';
        break;
      case 'contact':
        message = 'Hola! Me gustaría contactar con Galenus Panamá para una consulta.';
        break;
      case 'about':
        message = 'Hola! Me interesa conocer más sobre Galenus Panamá y sus servicios.';
        break;
      default:
        message = this.defaultMessage;
    }
    
    // Add page context if needed
    if (context.section !== 'home') {
      message += `\n\n(Estoy viendo la sección: ${this.getSectionName(context.section)})`;
    }
    
    return encodeURIComponent(message);
  }

  getSectionName(sectionId) {
    const sectionNames = {
      'home': 'Inicio',
      'about': 'Nosotros',
      'services': 'Servicios',
      'products': 'Productos',
      'contact': 'Contacto'
    };
    
    return sectionNames[sectionId] || sectionId;
  }

  buildWhatsAppUrl(message) {
    // Format phone number (remove any non-digit characters except +)
    const cleanNumber = this.whatsappNumber.replace(/[^\d+]/g, '');
    
    // Build WhatsApp URL
    return `https://wa.me/${cleanNumber}?text=${message}`;
  }

  openWhatsAppWindow(url) {
    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try to open WhatsApp app directly
      window.location.href = url;
    } else {
      // On desktop, open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  trackWhatsAppClick(context) {
    // You can implement analytics tracking here
    console.log('WhatsApp click tracked:', {
      section: context.section,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': context.section,
        'value': 1
      });
    }
  }

  // Method to update WhatsApp number if needed
  updateWhatsAppNumber(newNumber) {
    this.whatsappNumber = newNumber;
  }

  // Method to update default message
  updateDefaultMessage(newMessage) {
    this.defaultMessage = newMessage;
  }
}


// ===== CAROUSEL FUNCTIONALITY =====
class CarouselManager {
  constructor() {
    this.slides = document.querySelectorAll('.carousel__slide');
    this.indicators = document.querySelectorAll('.carousel__indicator');
    this.prevBtn = document.querySelector('.carousel__btn--prev');
    this.nextBtn = document.querySelector('.carousel__btn--next');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds
    
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) return;
    
    this.setupSlides();
    this.bindEvents();
    this.startAutoPlay();
    console.log('Carousel initialized! 🎠');
  }
  
  setupSlides() {
    // Set background images for slides
    this.slides.forEach((slide, index) => {
      const bgImage = slide.getAttribute('data-bg');
      if (bgImage) {
        slide.style.backgroundImage = `url(${bgImage})`;
      }
    });
  }
  
  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.hero__carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    // Touch/swipe support for mobile
    this.addTouchSupport();
  }
  
  addTouchSupport() {
    const carousel = document.querySelector('.hero__carousel');
    if (!carousel) return;
    
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }
  
  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    // Remove active class from current slide and indicator
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');
    
    // Set new current slide
    this.currentSlide = index;
    
    // Add active class to new slide and indicator
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
    
    // Reset auto-play
    this.resetAutoPlay();
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// ===== ENHANCED ANIMATIONS =====
class EnhancedAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupParallaxEffects();
    console.log('Enhanced Animations initialized! ✨');
  }
  
  setupScrollAnimations() {
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
    document.querySelectorAll('.service-card, .product-card, .contact__item').forEach(el => {
      observer.observe(el);
    });
  }
  
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat__number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
        }
      };
      
      // Start animation when element is in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            updateCounter();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }
  
  setupParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.floating__element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// ===== CHATBOT FUNCTIONALITY =====
class ChatbotManager {
  constructor() {
    this.chatbotToggle = document.getElementById('chatbotToggle');
    this.chatbotContainer = document.getElementById('chatbotContainer');
    this.chatbotClose = document.getElementById('chatbotClose');
    this.chatbotInput = document.getElementById('chatbotInput');
    this.chatbotSend = document.getElementById('chatbotSend');
    this.chatbotMessages = document.getElementById('chatbotMessages');
    this.quickQuestions = document.querySelectorAll('.quick-question');
    
    // Chatbot responses adapted for Galenus
    this.responses = {
      servicios: "Ofrecemos venta de medicamentos, consultas farmacéuticas, servicios de salud (medición de presión arterial, glucosa) y entrega a domicilio. ¿Te interesa algún servicio en particular?",
      medicamentos: "Tenemos un amplio catálogo de medicamentos de prescripción y venta libre, vitaminas y suplementos. Para consultas específicas sobre medicamentos, te recomiendo hablar con nuestro farmacéutico. ¿Te conecto por WhatsApp?",
      entrega: "Ofrecemos servicio de entrega a domicilio en 24 horas con embalaje seguro y seguimiento en tiempo real. ¿Te gustaría solicitar una entrega?",
      contacto: "Para consultas específicas, te recomiendo contactarnos por WhatsApp (+507 391-4481) donde nuestro equipo farmacéutico te responderá inmediatamente. ¿Te conecto ahora?",
      ubicacion: "Estamos ubicados en Centro Médico Los Galenos, Ciudad de Panamá. Ofrecemos servicios presenciales y entrega a domicilio.",
      horarios: "Nuestros horarios son: Lunes-Viernes: 7:00 AM - 7:00 PM, Sábados: 8:00 AM - 5:00 PM, Domingos: 9:00 AM - 1:00 PM.",
      precios: "Los precios de nuestros medicamentos varían según el producto. Para información específica sobre precios, te recomiendo contactar directamente con nuestro equipo. ¿Te conecto por WhatsApp?",
      receta: "Para medicamentos de prescripción necesitas presentar la receta médica. También ofrecemos consultas farmacéuticas para asesoramiento sobre medicamentos.",
      default: "Gracias por tu consulta. Para darte la mejor atención farmacéutica personalizada, te recomiendo hablar directamente con nuestro equipo. ¿Te conecto por WhatsApp?"
    };
    
    this.init();
  }
  
  init() {
    if (!this.chatbotToggle || !this.chatbotContainer) {
      console.warn('Chatbot elements not found');
      return;
    }
    
    // Show chatbot toggle immediately
    this.chatbotToggle.style.display = 'flex';
    this.chatbotToggle.style.opacity = '1';
    
    this.bindEvents();
    console.log('Chatbot initialized successfully! 🤖');
  }
  
  bindEvents() {
    // Toggle chatbot
    this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
    
    // Close chatbot
    this.chatbotClose.addEventListener('click', () => this.closeChatbot());
    
    // Send message
    this.chatbotSend.addEventListener('click', () => this.handleInput());
    
    // Enter key support
    this.chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleInput();
      }
    });
    
    // Quick questions
    this.quickQuestions.forEach(button => {
      button.addEventListener('click', () => {
        const question = button.textContent;
        this.sendMessage(question, true);
        const responseKey = button.getAttribute('data-question');
        setTimeout(() => {
          this.sendMessage(this.responses[responseKey], false);
        }, 1000);
      });
    });
  }
  
  toggleChatbot() {
    this.chatbotContainer.classList.toggle('active');
    if (this.chatbotContainer.classList.contains('active')) {
      this.chatbotToggle.style.display = 'none';
      this.chatbotInput.focus();
    }
  }
  
  closeChatbot() {
    this.chatbotContainer.classList.remove('active');
    this.chatbotToggle.style.display = 'flex';
  }
  
  sendMessage(message, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageContent.appendChild(messageText);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    this.chatbotMessages.appendChild(messageDiv);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    
    return messageDiv;
  }
  
  botResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = this.responses.default;
    
    // Detectar intenciones específicas que requieren WhatsApp
    if (lowerMessage.includes('medicamento') || lowerMessage.includes('medicina') || lowerMessage.includes('pastilla') || lowerMessage.includes('receta')) {
      response = this.responses.medicamentos;
    } else if (lowerMessage.includes('entrega') || lowerMessage.includes('domicilio') || lowerMessage.includes('envio')) {
      response = this.responses.entrega;
    } else if (lowerMessage.includes('servicio') || lowerMessage.includes('que ofrecen') || lowerMessage.includes('que hacen')) {
      response = this.responses.servicios;
    } else if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('email') || lowerMessage.includes('hablar')) {
      response = this.responses.contacto;
    } else if (lowerMessage.includes('ubicacion') || lowerMessage.includes('donde') || lowerMessage.includes('direccion')) {
      response = this.responses.ubicacion;
    } else if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('abierto')) {
      response = this.responses.horarios;
    } else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
      response = this.responses.precios;
    } else if (lowerMessage.includes('receta') || lowerMessage.includes('prescripcion')) {
      response = this.responses.receta;
    }
    
    setTimeout(() => {
      this.sendMessage(response, false);
      
      // Si la respuesta sugiere WhatsApp, agregar botón de WhatsApp
      if (response.includes('WhatsApp') || response.includes('conecto')) {
        setTimeout(() => {
          this.addWhatsAppButton();
        }, 2000);
      }
    }, 1000);
  }
  
  addWhatsAppButton() {
    const whatsappButton = document.createElement('div');
    whatsappButton.className = 'message bot-message';
    whatsappButton.innerHTML = `
      <div class="message-content" style="text-align: center; padding: 1rem;">
        <a href="https://wa.me/5073914481?text=Hola%20Galenus%20Panamá,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20farmacéuticos" 
           target="_blank" rel="noopener noreferrer" 
           style="background: #25D366; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">
          <i class="fab fa-whatsapp"></i> Conectar por WhatsApp
        </a>
      </div>
    `;
    this.chatbotMessages.appendChild(whatsappButton);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
  }
  
  handleInput() {
    const message = this.chatbotInput.value.trim();
    if (message) {
      this.sendMessage(message, true);
      this.chatbotInput.value = '';
      this.botResponse(message);
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new ThemeManager();
  new Navigation();
  new BackToTop();
  new ProductFilter();
  new ContactForm();
  new AnimationManager();
  new PerformanceOptimizer();
  new PWAManager();
  new AccessibilityManager();
  new CarouselManager();
  new EnhancedAnimations();
  new ChatbotManager();
  
  console.log('Galenus Panamá website initialized successfully!');
  console.log('Carousel initialized! 🎠');
  console.log('Enhanced Animations initialized! ✨');
  console.log('Chatbot Charlie Pity initialized! 🤖');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // You could send error reports to a logging service here
});
