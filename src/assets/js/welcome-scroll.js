/**
 * Script para agregar características de interacción a la página de bienvenida
 * Incluye animaciones de entrada, detección de secciones visibles, y desplazamiento suave
 */

// Función para inicializar el observador de intersección
function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que no soportan IntersectionObserver
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.classList.add('is-visible');
      });
      return;
    }
  
    // Configuración del observador de intersección
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // Cuando al menos el 10% de la sección es visible
    };
  
    // Callback para el observador
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Agregar clase para animar la entrada
          entry.target.classList.add('is-visible');
          
          // Activar los efectos de animación dentro de la sección
          const animatedElements = entry.target.querySelectorAll('.feature-card, .sport-card');
          animatedElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('is-visible');
            }, index * 100); // Staggered animation
          });
          
          // Actualizar la navegación activa
          updateActiveNavItem(entry.target.id);
          
          // Una vez que la sección sea visible, dejar de observarla
          // observer.unobserve(entry.target);
        }
      });
    };
  
    // Crear el observador
    const observer = new IntersectionObserver(handleIntersect, options);
    
    // Observar todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });
    
    // Observar también elementos animados dentro de las secciones
    document.querySelectorAll('.feature-card, .sport-card').forEach(el => {
      el.classList.add('fade-in-section');
    });
  }
  
  // Función para actualizar el item de navegación activo
  function updateActiveNavItem(sectionId) {
    if (!sectionId) return;
    
    // Quitar la clase activa de todos los enlaces de navegación
    document.querySelectorAll('nav a').forEach(anchor => {
      anchor.classList.remove('text-white');
      anchor.classList.add('text-gray-300');
    });
    
    // Agregar la clase activa al enlace correspondiente a la sección visible
    const activeAnchor = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (activeAnchor) {
      activeAnchor.classList.remove('text-gray-300');
      activeAnchor.classList.add('text-white');
    }
  }
  
  // Función para inicializar el desplazamiento suave
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Agregar la clase de animación wiggle al elemento objetivo
          targetElement.classList.add('wiggle-animation');
          
          // Quitar la clase después de que termine la animación
          setTimeout(() => {
            targetElement.classList.remove('wiggle-animation');
          }, 1000);
          
          // Desplazamiento suave
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Actualizar la URL sin causar un salto
          window.history.pushState(null, null, `#${targetId}`);
          
          // Actualizar la navegación activa
          updateActiveNavItem(targetId);
        }
      });
    });
    
    // Manejar los botones de membresía que usan el scrollToSection
    document.querySelectorAll('[data-scroll-to]').forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Agregar efecto de rebote al elemento objetivo
          targetElement.classList.add('bounce-animation');
          
          // Quitar el efecto después de que termine la animación
          setTimeout(() => {
            targetElement.classList.remove('bounce-animation');
          }, 2000);
          
          // Desplazamiento suave
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Actualizar la URL sin causar un salto
          window.history.pushState(null, null, `#${targetId}`);
          
          // Actualizar la navegación activa
          updateActiveNavItem(targetId);
        }
      });
    });
  }
  
  // Función para inicializar todos los efectos de animación
  function initAnimations() {
    // Agregar clases específicas para efectos de animación
    
    // Efecto pulsante para el plan más popular
    const popularPlan = document.querySelector('.transform.scale-105');
    if (popularPlan) {
      popularPlan.classList.add('pulse-animation');
    }
    
    // Efecto de brillo para el botón de membresías principal
    const membershipButtons = document.querySelectorAll('[data-scroll-to="memberships"]');
    membershipButtons.forEach(button => {
      button.classList.add('shine-effect');
    });
    
    // Scroll de la página al cargar si hay un hash en la URL
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Pequeño retraso para asegurar que la página esté completamente cargada
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Actualizar la navegación activa
          updateActiveNavItem(targetId);
        }, 500);
      }
    }
  }
  
  // Inicializar todo cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    initIntersectionObserver();
    initSmoothScrolling();
    initAnimations();
    
    // Inicializar las clases específicas para los elementos de membresía
    setTimeout(() => {
      const membershipSection = document.getElementById('memberships');
      if (membershipSection) {
        membershipSection.querySelectorAll('.bg-purple-600, .bg-yellow-600, .bg-blue-600').forEach(button => {
          button.classList.add('shine-effect');
        });
      }
    }, 1000);
  });
  
  // Re-inicializar los observadores cuando la ventana cambia de tamaño
  window.addEventListener('resize', () => {
    // Debounce la función para evitar llamadas excesivas
    if (window.resizeTimeout) {
      clearTimeout(window.resizeTimeout);
    }
    
    window.resizeTimeout = setTimeout(() => {
      initIntersectionObserver();
    }, 250);
  });