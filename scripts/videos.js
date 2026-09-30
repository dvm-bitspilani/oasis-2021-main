// YouTube is contacted only after the visitor explicitly plays a video.
for (const button of document.querySelectorAll('[data-video-id]')) {
  button.addEventListener('click', () => {
    const id = button.dataset.videoId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const frame = document.createElement('iframe');
    frame.width = '340'; frame.height = '200';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    frame.title = button.getAttribute('aria-label');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.border = '0';
    button.replaceWith(frame);
  }, { once: true });
}
// Preserve the original horizontal gallery wheel navigation on desktop.
document.addEventListener('wheel', (event) => {
  if (window.innerWidth <= 768 || !event.deltaY || event.ctrlKey) return;
  event.preventDefault();
  window.scrollBy({ left: event.deltaY, behavior: 'auto' });
}, { passive: false });
