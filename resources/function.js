
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNavLink();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Menú móvil ---------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú al elegir un enlace
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Resalta el enlace de la sección visible ---------- */
function initActiveNavLink() {
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Revelado al hacer scroll (una vez por elemento) ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-kicker, .section-title, .about-photo-wrap, .about-content, .skill-card, .project-card, .contact-info, .contact-form'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

/* ---------- Anima las barras de habilidades al entrar en pantalla ---------- */
function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const fill = card.querySelector('.skill-bar-fill');
      const percent = card.dataset.percent || 0;
      fill.style.width = `${percent}%`;
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });

  cards.forEach(card => observer.observe(card));
}

/* ---------- Validación y envío del formulario de contacto ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Escribe tu nombre completo.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Ingresa un email válido.',
    message: (v) => v.trim().length >= 10 || 'Cuéntame un poco más (mínimo 10 caracteres).',
  };

  function validateField(key) {
    const { input, error } = fields[key];
    const result = validators[key](input.value);
    error.textContent = result === true ? '' : result;
    return result === true;
  }

  Object.keys(fields).forEach(key => {
    fields[key].input.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Revisa los campos marcados antes de enviar.';
      status.classList.add('is-error');
      return;
    }

    // TODO: Conecta aquí tu backend, servicio de correo (ej. Formspree,
    // EmailJS) o endpoint propio para enviar el mensaje de verdad.
    // Por ahora, se simula un envío exitoso:
    status.classList.remove('is-error');
    status.textContent = 'Enviando…';

    setTimeout(() => {
      status.textContent = `¡Gracias, ${fields.name.input.value.split(' ')[0]}! Tu mensaje fue enviado.`;
      form.reset();
    }, 700);
  });
}

/* ---------- Botón volver arriba ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}