/* ==========================================================================
   ARCHIVED — Projects Section Filter Logic
   Removed from app.js on 2026-11-11. Kept for the future rebuild.

   To restore: paste this function into app.js and add
   initProjectFilters(); back to the DOMContentLoaded handler.
   Note: no .filter-btn elements existed in the markup, so this was already
   a no-op guard-clause function when the section was removed.
   ========================================================================== */

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.add('text-slate-400');
        b.classList.remove('text-white', 'border-white/10', 'bg-surface-3');
      });
      btn.classList.add('active');
      btn.classList.remove('text-slate-400');
      btn.classList.add('text-white', 'border-white/10', 'bg-surface-3');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
