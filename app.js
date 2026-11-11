/**
 * KH Mohammad Farhan — Interactive Controller
 * Refined interactions for world-class portfolio UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCardSpotlight();
  initMobileMenu();
  initThemeToggle();
  initScrollProgress();
  initBackToTop();
  initContactForm();
});

/* ==========================================================================
   1. Navbar Scroll + Active States
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPosition = window.pageYOffset + 240;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

/* ==========================================================================
   2. Card Spotlight / Cursor Glow
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileBtn && mobileMenu) {
    const setExpanded = (expanded) => {
      mobileBtn.setAttribute('aria-expanded', String(expanded));
    };

    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      setExpanded(!isHidden);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
        mobileBtn.focus();
      }
    });
  }
}

/* ==========================================================================
   4. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  if (!document.getElementById('themeToggle')) return;
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !systemDark)) {
    html.classList.remove('dark');
    updateThemeIcon(false);
  } else {
    html.classList.add('dark');
    updateThemeIcon(true);
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (isDark) {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
  } else {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  }
}

/* ==========================================================================
   5. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   6. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('contactBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  function setupForm() {
    if (typeof emailjs === 'undefined') {
      setTimeout(setupForm, 300);
      return;
    }

    emailjs.init({
      publicKey: '7BuqXseESSYiJ0N80',
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      const originalBtnText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      const templateParams = {
        name: form.elements['from_name'].value,
        email: form.elements['from_email'].value,
        message: form.elements['message'].value,
        reply_to: form.elements['from_email'].value,
      };

      emailjs.send('service_oy86v7p', 'template_s314x65', templateParams)
        .then(() => {
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
          form.reset();
          if (successMsg) {
            successMsg.classList.remove('hidden');
            setTimeout(() => { successMsg.classList.add('hidden'); }, 7000);
          }
          showToast('Message sent successfully!');
        })
        .catch((error) => {
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
          showToast('Failed to send. Please try again.');
          console.error('EmailJS error:', error);
        });
    });
  }

  setupForm();
}

/* ==========================================================================
   8. Clipboard + Toast
   ========================================================================== */
function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Copied to clipboard!');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(message || 'Copied to clipboard!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}