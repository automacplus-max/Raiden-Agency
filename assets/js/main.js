// ============ CASOS ANTES/DESPUÉS ============
// Para sumar un caso nuevo, agregá un objeto a este array. No hace falta tocar el resto del código.
// before / after: URL de la captura (o null para mostrar el placeholder "Agregar captura").
// link: URL del sitio deployado (o null para mostrar el botón como "Próximamente").
const CASE_STUDIES = [
  { rubro: 'Inmobiliaria — Maldonado', before: null, after: null, link: null },
  { rubro: 'Clínica dental', before: null, after: null, link: null },
  { rubro: 'Gimnasio', before: null, after: null, link: null },
];

function renderCaseStudyImage(url, label) {
  if (url) {
    return `<div class="case-study-img"><img src="${url}" alt="${label}" loading="lazy"><span class="case-study-tag-mini">${label}</span></div>`;
  }
  return `<div class="case-study-img"><div class="case-study-placeholder"><span>📷</span><span>Agregar captura<br>${label.toLowerCase()}</span></div><span class="case-study-tag-mini">${label}</span></div>`;
}

function renderCaseStudyCard(item) {
  const linkHtml = item.link
    ? `<a href="${item.link}" target="_blank" rel="noopener" class="btn btn-ghost case-study-link">Ver en vivo</a>`
    : `<span class="btn btn-ghost case-study-link" aria-disabled="true">Próximamente</span>`;

  return `
    <article class="case-study-card reveal">
      <div class="case-study-compare">
        ${renderCaseStudyImage(item.before, 'Antes')}
        ${renderCaseStudyImage(item.after, 'Después')}
      </div>
      <div class="case-study-info">
        <span class="case-study-badge">Rediseño de muestra — no solicitado</span>
        <h3>${item.rubro}</h3>
        ${linkHtml}
      </div>
    </article>
  `;
}

const caseStudyGrid = document.getElementById('caseStudyGrid');
if (caseStudyGrid) {
  caseStudyGrid.innerHTML = CASE_STUDIES.map(renderCaseStudyCard).join('');
}

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
const formSuccess = document.getElementById('formSuccess');
const formSuccessReset = document.getElementById('formSuccessReset');

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
      contactForm.reset();
      contactForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      throw new Error('submit failed');
    }
  } catch (err) {
    formNote.textContent = 'No pudimos enviar tu mensaje. Escribime a raidenagencyinfo@gmail.com.';
    formNote.classList.add('form-note-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
});

formSuccessReset.addEventListener('click', () => {
  formSuccess.hidden = true;
  contactForm.hidden = false;
});
