// Minimal interactivity
let currentPage = 1;
const totalPages = 6;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupNav();
  setupPDF();
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
  if (oldEl) oldEl.classList.remove('active');
  if (newEl) newEl.classList.add('active');
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
}

function closePDF() {
  const overlay = document.getElementById('pdf-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

window.navigateToPage = navigateToPage;
window.openPDF = openPDF;
window.closePDF = closePDF;

