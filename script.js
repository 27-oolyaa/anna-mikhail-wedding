// Countdown to the wedding ceremony: 20 June 2027, 16:00 Moscow time.
const weddingDate = new Date('2027-06-20T16:00:00+03:00').getTime();
const fields = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};
const pad = value => String(value).padStart(2, '0');

function updateCountdown() {
  const distance = weddingDate - Date.now();
  if (distance <= 0) {
    Object.values(fields).forEach(el => el.textContent = '00');
    document.querySelector('.countdown-date').textContent = 'Сегодня наш день!';
    return;
  }
  fields.days.textContent = Math.floor(distance / 86400000);
  fields.hours.textContent = pad(Math.floor((distance % 86400000) / 3600000));
  fields.minutes.textContent = pad(Math.floor((distance % 3600000) / 60000));
  fields.seconds.textContent = pad(Math.floor((distance % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Smooth reveal on scroll, with a graceful fallback for older browsers.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Mobile navigation.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.topbar nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// RSVP: отправка в Google Таблицу через опубликованный Google Apps Script.
// Вставьте URL веб-приложения вместо пустой строки после публикации Apps Script.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxx5ni7d8fd4J_bVjnhtsNEewe7MmBGv-QpCvg-NLm7G9ZQsCvknGJzk5LJLEEtcJF/exec';
const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  data.submittedAt = new Date().toISOString();
  try {
    const responses = JSON.parse(localStorage.getItem('wedding-rsvp-responses') || '[]');
    responses.push(data);
    localStorage.setItem('wedding-rsvp-responses', JSON.stringify(responses));
    status.textContent = 'Спасибо! Ваш ответ сохранён на этом устройстве.';
    form.reset();
  } catch (error) {
    status.textContent = 'Не удалось сохранить ответ в браузере. Пожалуйста, свяжитесь с молодожёнами напрямую.';
  }
});
