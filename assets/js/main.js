// ============ NAVBAR: scroll state + mobile menu ============
const navbar = document.querySelector('.navbar');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('open');
  navMobile.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ============ COUNTER ANIMATION ============
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = String(target).includes('.');
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

countEls.forEach(el => countObserver.observe(el));

// ============ CURSOR GLOW ============
const cursorGlow = document.getElementById('cursorGlow');
let glowX = 0, glowY = 0, curX = 0, curY = 0;

window.addEventListener('mousemove', (e) => {
  glowX = e.clientX;
  glowY = e.clientY;
  cursorGlow.style.opacity = '1';
}, { passive: true });

function animateGlow() {
  curX += (glowX - curX) * 0.12;
  curY += (glowY - curY) * 0.12;
  cursorGlow.style.left = curX + 'px';
  cursorGlow.style.top = curY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Enviando...';
  formNote.textContent = '';
  formNote.classList.remove('form-note-error');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      formNote.textContent = '¡Gracias! Recibimos tu mensaje, te contactamos en menos de 24hs.';
      contactForm.reset();
    } else {
      throw new Error('submit failed');
    }
  } catch (err) {
    formNote.textContent = 'No pudimos enviar tu mensaje. Escribinos a hola@raidenservices.com.';
    formNote.classList.add('form-note-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
});
