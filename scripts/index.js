// Room pages do not all contain a menu. Initialize only controls that exist.
const menu = document.querySelector('.menu-btn');
const nav = document.getElementById('mySidenav');
if (menu && nav) {
  let open = false;
  const setOpen = (value) => {
    open = value;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close room navigation' : 'Open room navigation');
    nav.style.width = open ? (window.innerWidth < 768 ? '300px' : '500px') : '0';
    const room = document.querySelector('.main-div');
    const icons = document.querySelector('.icon-desk');
    if (room) room.style.opacity = open ? '0.4' : '1';
    if (icons) icons.style.display = open ? 'none' : 'flex';
  };
  menu.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

const warmed = new Set();
for (const link of document.querySelectorAll('a[data-prefetch-assets]')) {
  const warm = () => {
    for (const href of [link.href, ...link.dataset.prefetchAssets.split(' ')]) {
      if (!href || warmed.has(href)) continue;
      const resource = document.createElement('link');
      resource.rel = 'prefetch';
      resource.href = href;
      document.head.append(resource);
      warmed.add(href);
    }
  };
  link.addEventListener('pointerenter', warm, { once: true });
  link.addEventListener('focus', warm, { once: true });
  link.addEventListener('touchstart', warm, { once: true, passive: true });
}
