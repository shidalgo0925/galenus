// ===== GLOBAL VARIABLES =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

// ===== EMAILJS CONFIGURATION =====
// Configuración de EmailJS - REEMPLAZA CON TUS CREDENCIALES REALES
const EMAILJS_CONFIG = {
  serviceId: 'service_galenus', // ⚠️ REEMPLAZA: Tu Service ID de EmailJS
  templateId: 'template_contact', // ⚠️ REEMPLAZA: Tu Template ID para contacto
  newsletterTemplateId: 'template_newsletter', // ⚠️ REEMPLAZA: Tu Template ID para newsletter
  publicKey: 'your_public_key' // ⚠️ REEMPLAZA: Tu Public Key de EmailJS
};

// 📧 INSTRUCCIONES PARA CONFIGURAR:
// 1. Ve a https://www.emailjs.com/
// 2. Crea una cuenta gratuita
// 3. Agrega un servicio de email (Gmail/Outlook)
// 4. Crea los templates de email
// 5. Copia las credenciales y reemplaza los valores arriba

// ===== EMAIL MANAGER =====
class EmailManager {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Inicializar EmailJS
      if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        this.isInitialized = true;
        console.log('EmailJS inicializado correctamente');
      } else {
        console.warn('EmailJS no está disponible');
      }
    } catch (error) {
      console.error('Error al inicializar EmailJS:', error);
    }
  }

  async sendContactForm(formData) {
    if (!this.isInitialized) {
      throw new Error('EmailJS no está inicializado');
    }

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_email: 'info@galenuspanama.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Error al enviar email de contacto:', error);
      throw error;
    }
  }

  async sendNewsletterSubscription(email) {
    if (!this.isInitialized) {
      throw new Error('EmailJS no está inicializado');
    }

    try {
      const templateParams = {
        email: email,
        to_email: 'info@galenuspanama.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.newsletterTemplateId,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Error al enviar suscripción al newsletter:', error);
      throw error;
    }
  }

  showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        .notification--success {
          background: #10b981;
          color: white;
        }
        .notification--error {
          background: #ef4444;
          color: white;
        }
        .notification.show {
          transform: translateX(0);
        }
        .notification__content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);

    // Ocultar y remover después de 5 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
}

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
      // Usar el logo PNG en lugar de SVG
      const logoSrc = 'images/logo.png?v=20251015';
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


// ===== CONTACT FORM =====
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }
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
      // Enviar email usando EmailJS
      await emailManager.sendContactForm(data);
      
      this.showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
      contactForm.reset();
      
    } catch (error) {
      console.error('Error al enviar email:', error);
      this.showNotification('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
    } finally {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('#newsletter-email');
    const email = emailInput.value.trim();
    
    // Validar email
    if (!this.isValidEmail(email)) {
      this.showNotification('Por favor ingresa un email válido', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
      // Enviar suscripción usando EmailJS
      await emailManager.sendNewsletterSubscription(email);
      
      this.showNotification('¡Te has suscrito exitosamente a nuestro newsletter!', 'success');
      newsletterForm.reset();
      
    } catch (error) {
      console.error('Error al suscribirse al newsletter:', error);
      this.showNotification('Error al suscribirse. Por favor intenta nuevamente.', 'error');
    } finally {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    // PWA deshabilitada: no registrar Service Worker ni mostrar banner de instalación
  }

  async registerServiceWorker() {}

  setupInstallPrompt() {}

  showInstallBanner() {}

  hideInstallBanner() {}

  async installApp() {}
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

// ===== SHOP FUNCTIONALITY =====
class ShoppingCart {
  constructor() {
    this.items = [];
    this.init();
  }

  init() {
    this.loadCart();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Botón agregar al carrito
    const addToCartBtn = document.querySelector('.product__btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    // Botón de favoritos
    const favoriteBtn = document.querySelector('.product__btn.btn--outline');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => this.toggleFavorite());
    }
  }

  addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = {
      id: 'begobano-esponja',
      name: 'Begobaño Esponja Jabonosa De Un Solo Uso En Bolsa De Esponjas',
      quantity: quantity,
      image: 'images/products/begobano-esponja.webp',
      category: 'ESONJA DE BAÑOS',
      description: 'Paquete de 24 Unidades. Tamaño: Longitud: 20cm, Ancho: 12cm, Grosor: 0.5cm'
    };

    // Verificar si el producto ya está en el carrito
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(product);
    }

    this.saveCart();
    this.showCartNotification(product);
    this.updateCartUI();
    
    // Mostrar opciones después de agregar al carrito
    setTimeout(() => {
      this.showCartOptions();
    }, 1000);
  }

  showCartOptions() {
    const optionsModal = document.createElement('div');
    optionsModal.className = 'cart-options-modal';
    optionsModal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Producto agregado al carrito</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <p>¿Qué te gustaría hacer ahora?</p>
            <div class="modal-actions">
              <button class="btn btn--primary" onclick="window.shoppingCart.contactForQuote()">
                <i class="fas fa-phone"></i>
                Solicitar Cotización
              </button>
              <button class="btn btn--outline" onclick="window.shoppingCart.continueShopping()">
                <i class="fas fa-shopping-bag"></i>
                Seguir Comprando
              </button>
              <button class="btn btn--secondary" onclick="window.shoppingCart.viewCart()">
                <i class="fas fa-shopping-cart"></i>
                Ver Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(optionsModal);
    
    // Event listeners para cerrar modal
    const closeBtn = optionsModal.querySelector('.modal-close');
    const overlay = optionsModal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => this.closeModal(optionsModal));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal(optionsModal);
    });
  }

  closeModal(modal) {
    modal.classList.add('closing');
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 300);
  }

  contactForQuote() {
    // Cerrar todos los modales
    const modals = document.querySelectorAll('.cart-options-modal, .cart-summary-modal');
    modals.forEach(modal => {
      if (document.body.contains(modal)) {
        this.closeModal(modal);
      }
    });
    
    // Redirigir a WhatsApp con información del carrito
    const cartItems = this.getCartItems();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const message = `Hola! Me interesa solicitar una cotización para:\n\n` +
      cartItems.map(item => 
        `• ${item.name}\n  Cantidad: ${item.quantity} unidades\n  Categoría: ${item.category}\n  Descripción: ${item.description}`
      ).join('\n\n') +
      `\n\nTotal de items: ${totalItems}\n\n¿Podrían enviarme información sobre precios y disponibilidad?`;
    
    const whatsappUrl = `https://wa.me/50760004449?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito después de enviar la solicitud
    setTimeout(() => {
      this.clearCart();
      this.showNotification('Solicitud enviada. El carrito ha sido limpiado.', 'success');
    }, 1000);
  }

  continueShopping() {
    const modal = document.querySelector('.cart-options-modal');
    if (modal) this.closeModal(modal);
    
    this.showNotification('¡Perfecto! Puedes seguir agregando productos', 'info');
  }

  viewCart() {
    const modal = document.querySelector('.cart-options-modal');
    if (modal) this.closeModal(modal);
    
    // Mostrar resumen del carrito
    this.showCartSummary();
  }

  showCartSummary() {
    const cartItems = this.getCartItems();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const summaryModal = document.createElement('div');
    summaryModal.className = 'cart-summary-modal';
    summaryModal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Resumen del Carrito</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="cart-items">
              ${cartItems.map(item => `
                <div class="cart-item">
                  <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Categoría: ${item.category}</p>
                    <p>Descripción: ${item.description}</p>
                    <p>Cantidad: ${item.quantity} unidades</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="cart-total">
              <p><strong>Total de items: ${totalItems}</strong></p>
            </div>
            <div class="modal-actions">
              <button class="btn btn--primary" onclick="window.shoppingCart.contactForQuote()">
                <i class="fas fa-phone"></i>
                Solicitar Cotización
              </button>
              <button class="btn btn--outline" onclick="window.shoppingCart.clearCart()">
                <i class="fas fa-trash"></i>
                Limpiar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(summaryModal);
    
    // Event listeners
    const closeBtn = summaryModal.querySelector('.modal-close');
    const overlay = summaryModal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => this.closeModal(summaryModal));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal(summaryModal);
    });
  }

  toggleFavorite() {
    const favoriteBtn = document.querySelector('.product__btn.btn--outline');
    const isFavorited = favoriteBtn.classList.contains('favorited');
    
    if (isFavorited) {
      favoriteBtn.classList.remove('favorited');
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favoritos';
      this.showNotification('Producto removido de favoritos', 'info');
    } else {
      favoriteBtn.classList.add('favorited');
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> En Favoritos';
      this.showNotification('Producto agregado a favoritos', 'success');
    }
  }

  showCartNotification(product) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <span>${product.quantity} ${product.quantity === 1 ? 'unidad' : 'unidades'} agregada${product.quantity === 1 ? '' : 's'} al carrito</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  updateCartUI() {
    // Aquí puedes actualizar un contador de carrito si lo tienes
    const cartCount = this.items.reduce((total, item) => total + item.quantity, 0);
    console.log(`Carrito: ${cartCount} items`);
  }

  saveCart() {
    localStorage.setItem('galenus-cart', JSON.stringify(this.items));
  }

  loadCart() {
    const savedCart = localStorage.getItem('galenus-cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }

  getCartItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
    
    // Cerrar cualquier modal abierto
    const modals = document.querySelectorAll('.cart-options-modal, .cart-summary-modal');
    modals.forEach(modal => {
      if (document.body.contains(modal)) {
        this.closeModal(modal);
      }
    });
    
    // Mostrar notificación
    this.showNotification('Carrito limpiado correctamente', 'success');
    
    // Resetear cantidad a 1
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
      quantityInput.value = 1;
    }
  }
}

function increaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  const currentValue = parseInt(quantityInput.value);
  const maxValue = parseInt(quantityInput.max);
  
  if (currentValue < maxValue) {
    quantityInput.value = currentValue + 1;
  }
}

function decreaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  const currentValue = parseInt(quantityInput.value);
  const minValue = parseInt(quantityInput.min);
  
  if (currentValue > minValue) {
    quantityInput.value = currentValue - 1;
  }
}

// ===== WHATSAPP INTEGRATION =====
class WhatsAppManager {
  constructor() {
    this.whatsappButton = document.getElementById('whatsapp-button');
    this.whatsappFloat = document.getElementById('whatsapp-float');
    this.whatsappTooltip = document.getElementById('whatsapp-tooltip');
    
    // WhatsApp configuration
    this.whatsappNumber = '+50760004449'; // Número principal de Galenus Panamá
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
      contacto: "Para consultas específicas, te recomiendo contactarnos por WhatsApp (+507 6000-4449) donde nuestro equipo farmacéutico te responderá inmediatamente. ¿Te conecto ahora?",
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
        <a href="https://wa.me/50760004449?text=Hola%20Galenus%20Panamá,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20farmacéuticos" 
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
// Inicializar EmailManager globalmente
let emailManager;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new ThemeManager();
  new Navigation();
  new BackToTop();
  new ContactForm();
  window.shoppingCart = new ShoppingCart();
  new AnimationManager();
  new PerformanceOptimizer();
  new PWAManager();
  new AccessibilityManager();
  
  // Initialize EmailManager
  emailManager = new EmailManager();
  
  // Initialize carousel
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
