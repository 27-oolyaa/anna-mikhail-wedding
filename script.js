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

// RSVP: отправка в Google Таблицу через Google Apps Script.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxx5ni7d8fd4J_bVjnhtsNEewe7MmBGv-QpCvg-NLm7G9ZQsCvknGJzk5LJLEEtcJF/exec';
const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  data.submittedAt = new Date().toISOString();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  status.textContent = 'Отправляем ответ…';

  try {
    // Google Apps Script принимает urlencoded POST. В no-cors браузер не
    // раскрывает ответ сервера, поэтому успех сети не гарантирует запись в таблицу.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(data).toString()
    });
    status.textContent = 'Спасибо! Ответ отправлен. Если запись не появилась в таблице, сообщите молодожёнам.';
    form.reset();
  } catch (error) {
    status.textContent = 'Не удалось отправить ответ. Проверьте интернет и попробуйте ещё раз.';
  } finally {
    submitButton.disabled = false;
  }
});
