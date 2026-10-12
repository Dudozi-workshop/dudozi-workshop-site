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
