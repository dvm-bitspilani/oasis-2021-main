// Room pages do not all contain a menu. Initialize only controls that exist.
for (const loader of document.querySelectorAll('.loader')) loader.hidden = true;
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
