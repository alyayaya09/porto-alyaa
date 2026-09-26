document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.getElementById('burgerBtn');
const panel = document.getElementById('mobilePanel');
function closePanel(){
  panel.classList.remove('is-open');
  burger.setAttribute('aria-expanded','false');
}
function togglePanel(){
  const open = panel.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
}
burger.addEventListener('click', togglePanel);
document.querySelectorAll('[data-nav]').forEach(link=>{
  link.addEventListener('click', closePanel);
});

const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('main section[id]');
const spyObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l=>{
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach(s=>spyObserver.observe(s));

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => revealObserver.observe(el));
}

const skillRows = document.querySelectorAll('.skill-row');
const skillObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const pct = entry.target.getAttribute('data-pct');
      entry.target.querySelector('.skill-fill').style.width = pct + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
skillRows.forEach(row=>skillObserver.observe(row));

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', function(e){
  e.preventDefault();
  note.textContent = 'Pesan tersimpan secara lokal — hubungkan form ini ke layanan email atau backend Anda agar benar-benar terkirim.';
  form.reset();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ Spotlight halus ngikutin kursor di kartu proyek ============ */
if (!prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

/* ============ Foto ngikutin gerakan mouse (3D tilt) — Home & Tentang ============ */
const tiltEls = document.querySelectorAll('.tilt-target');

if (tiltEls.length && !prefersReducedMotion) {
  const maxTilt = 16;
  const influenceRadius = 480;
  let mouseX = -9999;
  let mouseY = -9999;
  let ticking = false;

  function updateTilt(){
    tiltEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / influenceRadius);
      const rotateY = (dx / rect.width) * maxTilt * influence;
      const rotateX = -(dy / rect.height) * maxTilt * influence;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    ticking = false;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      window.requestAnimationFrame(updateTilt);
      ticking = true;
    }
  });
}