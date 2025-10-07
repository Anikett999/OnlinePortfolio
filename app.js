// Minimal interactivity
let currentPage = 1;
const totalPages = 6;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupNav();
  setupPDF();
  // Open PDF overlay by default on initial load (without fullscreen/orientation)
  const overlay = document.getElementById('pdf-overlay');
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Initialize waterfall fade-in on scroll
  initSectionObserver();
  // If there are hash links, ensure smooth scroll behavior is native; highlight on arrival
  highlightSectionFromHash();

  // Build greetings grid
  buildGreetings();
});

function setupNav() {
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(a.getAttribute('data-page'));
      navigateToPage(page);
    });
  });
}

function navigateToPage(page) {
  if (page < 1 || page > totalPages) return;
  const oldEl = document.getElementById(`page-${currentPage}`);
  const newEl = document.getElementById(`page-${page}`);
  if (oldEl) oldEl.classList.remove('visible');
  if (newEl) newEl.classList.add('visible');
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', parseInt(a.getAttribute('data-page')) === page);
  });
  currentPage = page;
}

function setupPDF() {
  const overlay = document.getElementById('pdf-overlay');
  const openBtn = document.getElementById('pdf-toggle');
  const closeBtn = document.getElementById('close-pdf');
  if (openBtn) openBtn.addEventListener('click', openPDF);
  if (closeBtn) closeBtn.addEventListener('click', closePDF);
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closePDF(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePDF(); });
}

function openPDF() {
  const overlay = document.getElementById('pdf-overlay');
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Try to enter fullscreen on user gesture only
  const container = overlay;
  const requestFs = container && (container.requestFullscreen || container.webkitRequestFullscreen || container.msRequestFullscreen);
  if (requestFs) {
    try {
      requestFs.call(container);
    } catch (e) {
      // no-op; fullscreen not allowed
    }
  }

  // Attempt landscape orientation when supported (user gesture contexts)
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {
      // Some browsers require fullscreen or deny lock; ignore failures gracefully
    });
  }

  // Make the iframe fill the screen and hint viewer to fit page width
  const frame = document.getElementById('pdf-frame');
  if (frame) {
    frame.style.height = '100vh';
    frame.style.width = '100%';
    try {
      const base = frame.src.split('#')[0];
      frame.src = `${base}#view=FitH`;
    } catch (_) {}
  }
}

function closePDF() {
  const overlay = document.getElementById('pdf-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = 'auto';

  // Exit fullscreen if we entered it
  const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (exitFs && document.fullscreenElement) {
    try {
      exitFs.call(document);
    } catch (e) {
      // ignore
    }
  }

  // Unlock orientation where supported
  if (screen.orientation && screen.orientation.unlock) {
    try { screen.orientation.unlock(); } catch (_) {}
  }

  // Restore iframe sizing
  const frame = document.getElementById('pdf-frame');
  if (frame) {
    frame.style.height = '';
    frame.style.width = '';
  }
}

function initSectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.page').forEach((section) => observer.observe(section));
}

function highlightSectionFromHash() {
  if (!location.hash) return;
  const id = location.hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}

function buildGreetings() {
  const greetings = ['こんにちは','Здравствуйте','hey','σας γεια','안녕하세요','Hola','Bonjour','Ciao','नमस्ते','مرحبا','Olá','Hallo','Hej','สวัสดี','שלום'];
  const grid = document.getElementById('greetings-grid');
  if (!grid) return;
  grid.innerHTML = '';
  greetings.forEach((g) => {
    const span = document.createElement('span');
    span.className = 'greet';
    span.textContent = g;
    grid.appendChild(span);
  });
}

window.navigateToPage = navigateToPage;
window.openPDF = openPDF;
window.closePDF = closePDF;

