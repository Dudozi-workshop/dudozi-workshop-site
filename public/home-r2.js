document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = link.closest('details');
    if (menu) menu.open = false;
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const menu = document.querySelector('.mobile-menu[open]');
    if (menu) menu.open = false;
  }
});
document.addEventListener('click', event => {
  const menu = document.querySelector('.mobile-menu[open]');
  if (menu && !menu.contains(event.target)) menu.open = false;
});


const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.section-heading, .product-card, .studio-hero, .studio-note, .studio-values, .studio-making, .closing-inner'
  );
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', Math.min(index % 3, 2) * 70 + 'ms');
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}


if ('IntersectionObserver' in window) {
  const navMap = new Map([
    ['apps', document.querySelector('.desktop-nav a[href="#apps"]')],
    ['studio', document.querySelector('.desktop-nav a[href="#studio"]')]
  ]);
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navMap.forEach(link => link?.classList.remove('is-active'));
    navMap.get(visible.target.id)?.classList.add('is-active');
  }, { threshold: [0.2, 0.45], rootMargin: '-20% 0px -55% 0px' });
  ['apps', 'studio'].forEach(id => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
  });
}
