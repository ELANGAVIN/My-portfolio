// ── Utility Functions ──
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

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
const scrollHandler = throttle(() => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, 100);

window.addEventListener('scroll', scrollHandler, { passive: true });

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden', '');
    }
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('hidden', '');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('hidden', '');
  }
}, { passive: true });

// ── Scroll reveal with Intersection Observer ──
const revealEls = document.querySelectorAll('.reveal');
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
      });
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealEls.forEach(el => observer.observe(el));

// ── Skill bar animation ──
const barsSection = document.getElementById('skillBars');
if (barsSection) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          document.querySelectorAll('.bar-fill').forEach(bar => {
            const width = bar.dataset.width;
            bar.style.width = width + '%';
          });
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  barObserver.observe(barsSection);
}

// ── Form validation and submission ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Form validation
  const validateForm = (form) => {
    let isValid = true;
    const errors = {};

    // Get form fields
    const firstName = form.querySelector('#firstName').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Validate first name
    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate message
    if (!message) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    // Display errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    Object.entries(errors).forEach(([field, error]) => {
      const errorEl = document.getElementById(`${field}Error`);
      if (errorEl) {
        errorEl.textContent = error;
      }
    });

    return isValid;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm(contactForm)) {
      return;
    }

    const btn = contactForm.querySelector('button[type=submit]');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    // Disable button and show loading state
    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    successMsg.setAttribute('hidden', '');
    errorMsg.setAttribute('hidden', '');

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Show success message
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      successMsg.removeAttribute('hidden');
      
      // Reset form
      contactForm.reset();

      // Reset button after 4 seconds
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        successMsg.setAttribute('hidden', '');
      }, 4000);
    } catch (error) {
      // Show error message
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      errorMsg.removeAttribute('hidden');
      console.error('Form submission error:', error);
    }
  });
}

// ── Smooth active nav highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const updateActiveNav = throttle(() => {
  const scrollY = window.scrollY + 120;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (active) {
        active.style.color = 'var(--accent)';
      }
    }
  });
}, 100);

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Cursor glow effect ──
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, .06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: opacity .4s;
  opacity: 1;
`;

document.body.appendChild(glow);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', throttle((e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  glow.style.left = mouseX + 'px';
  glow.style.top = mouseY + 'px';
}, 50), { passive: true });

document.addEventListener('mouseleave', () => {
  glow.style.opacity = '0';
}, { passive: true });

document.addEventListener('mouseenter', () => {
  glow.style.opacity = '1';
}, { passive: true });

// ── Performance: Lazy load images ──
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!' || !document.querySelector(href)) return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Theme detection and support for dark/light mode ──
function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (prefersDark) {
    document.documentElement.style.colorScheme = 'dark';
  } else if (prefersLight) {
    document.documentElement.style.colorScheme = 'light';
  }
}

initTheme();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme);

// ── Performance monitoring ──
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          console.log(`Long task detected: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (e) {
    // Performance observer not supported
  }
}

// ── Keyboard navigation support ──
document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if (e.key === 'Escape' && hamburger && hamburger.classList.contains('open')) {
    hamburger.click();
  }
});

// ── Initialize on page load ──
window.addEventListener('load', () => {
  // Remove loading class if present
  document.body.classList.remove('loading');
  
  // Trigger scroll event to ensure nav state is correct
  scrollHandler();
}, { passive: true });

console.log('%cPortfolio Loaded ✨', 'color: #38bdf8; font-size: 14px; font-weight: bold;');