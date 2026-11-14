/**
 * KH Mohammad Farhan — portfolio controller
 *
 * Motion rules on this page: one easing curve, transform and opacity only,
 * no looping animation, and every reveal fires once.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initReveals();
  initTagline();
  initBackToTop();
  initContactForm();
  initCopyButtons();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   1. Header: surface on scroll, current section marked in the navigation
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;

  function update() {
    ticking = false;

    header.classList.toggle('is-scrolled', window.scrollY > 8);

    // The current section is the last one whose top has passed a probe line
    // a little below the header.
    const probe = window.scrollY + Math.min(220, window.innerHeight * 0.35);
    let currentId = '';

    sections.forEach(section => {
      if (section.offsetTop <= probe) currentId = section.id;
    });

    links.forEach(link => {
      const isCurrent = link.getAttribute('href') === '#' + currentId;
      if (isCurrent) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
}

/* --------------------------------------------------------------------------
   2. Mobile navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const panel = document.getElementById('mobilePanel');
  if (!toggle || !panel) return;

  const links = Array.from(panel.querySelectorAll('a'));

  function open() {
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  links.forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && panel.classList.contains('is-open')) {
      close();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Section reveals, fired once
   -------------------------------------------------------------------------- */
function initReveals() {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  items.forEach(item => observer.observe(item));
}

/* --------------------------------------------------------------------------
   4. Tagline reveal, word by word, as each word crosses the trigger line
   -------------------------------------------------------------------------- */
function initTagline() {
  const lines = Array.from(document.querySelectorAll('[data-tagline]'));
  if (!lines.length) return;

  const words = [];

  lines.forEach(line => {
    const text = line.textContent.replace(/\s+/g, ' ').trim();
    line.textContent = '';

    text.split(' ').forEach((word, index, all) => {
      const span = document.createElement('span');
      span.className = 'tagline-word';
      span.textContent = word;
      line.appendChild(span);
      if (index < all.length - 1) {
        line.appendChild(document.createTextNode(' '));
      }
      words.push(span);
    });
  });

  if (reducedMotion) {
    words.forEach(word => word.classList.add('is-lit'));
    return;
  }

  const trigger = window.innerHeight * 0.72;
  let ticking = false;

  function update() {
    ticking = false;
    words.forEach(word => {
      if (word.classList.contains('is-lit')) return;
      const box = word.getBoundingClientRect();
      if (box.top <= trigger) word.classList.add('is-lit');
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', update);
  update();
}

/* --------------------------------------------------------------------------
   5. Back to top
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  let ticking = false;

  function update() {
    ticking = false;
    button.classList.toggle('is-visible', window.scrollY > 600);
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  update();
}

/* --------------------------------------------------------------------------
   6. Contact form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const button = document.getElementById('contactBtn');
  const buttonLabel = document.getElementById('contactBtnLabel');
  const status = document.getElementById('formStatus');

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldOf(input) {
    return input.closest('[data-field]');
  }

  function validateField(input) {
    const wrapper = fieldOf(input);
    if (!wrapper) return true;

    let valid = true;
    const value = input.value.trim();

    if (input.required && value === '') {
      valid = false;
    } else if (input.type === 'email' && value !== '' && !EMAIL.test(value)) {
      valid = false;
    }

    wrapper.classList.toggle('has-error', !valid);
    return valid;
  }

  form.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const wrapper = fieldOf(input);
      if (wrapper && wrapper.classList.contains('has-error')) validateField(input);
    });
  });

  function setStatus(kind, message) {
    if (!status) return;
    status.className = 'form-status is-visible form-status--' + kind;
    status.textContent = message;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();

    const required = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    const allValid = required.map(validateField).every(Boolean);

    if (!allValid) {
      setStatus('error', 'Some fields need attention before this can be sent.');
      const firstBad = form.querySelector('.has-error input, .has-error textarea');
      if (firstBad) firstBad.focus();
      return;
    }

    const originalLabel = buttonLabel.textContent;
    button.disabled = true;
    buttonLabel.textContent = 'Sending';

    const payload = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json' },
    })
      .then(async response => {
        button.disabled = false;
        buttonLabel.textContent = originalLabel;

        if (response.ok) {
          form.reset();
          setStatus('ok', 'Message sent. I usually reply within two working days.');
          showToast('Message sent');
        } else {
          const result = await response.json().catch(() => ({}));
          setStatus('error', 'The send failed. Email me directly and I will pick it up.');
          console.error('Web3Forms error:', result);
        }
      })
      .catch(error => {
        button.disabled = false;
        buttonLabel.textContent = originalLabel;
        setStatus('error', 'The send failed. Email me directly and I will pick it up.');
        console.error('Web3Forms error:', error);
      });
  });
}

/* --------------------------------------------------------------------------
   7. Copy buttons and toast
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-copy');
      const done = () => showToast('Email address copied');

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done).catch(fallbackCopy.bind(null, value, done));
      } else {
        fallbackCopy(value, done);
      }
    });
  });
}

function fallbackCopy(value, done) {
  const area = document.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand('copy');
  } catch (error) {
    console.error('Copy failed:', error);
  }
  document.body.removeChild(area);
  done();
}

let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMsg');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('is-visible');

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2600);
}
