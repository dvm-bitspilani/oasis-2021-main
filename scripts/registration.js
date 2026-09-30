import { validateRegistration } from './demo-validation.js';
const form = document.getElementById('registration-demo');
const status = document.getElementById('demo-result');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const errors = validateRegistration(Object.fromEntries(new FormData(form)));
  status.textContent = errors.length ? errors.join(' ') : 'Demo complete: the registration preview is valid. Nothing was sent or stored.';
});
