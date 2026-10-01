const notice = document.getElementById('registration-closed');
const closeButton = document.getElementById('registration-close');
if (notice && typeof notice.showModal === 'function') {
  // The open attribute also displays the notice when JavaScript is unavailable.
  notice.removeAttribute('open');
  notice.showModal();
  closeButton.addEventListener('click', () => notice.close());
  notice.addEventListener('close', () => document.querySelector('.registration-back').focus());
} else if (notice && closeButton) {
  closeButton.addEventListener('click', () => { notice.hidden = true; document.querySelector('.registration-back').focus(); });
}
