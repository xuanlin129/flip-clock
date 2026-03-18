const date = document.querySelector('#date');
const clock = document.querySelector('#clock');
const themeToggle = document.querySelector('select[name="theme"]');
const timeFormatToggle = document.querySelector('select[name="timeFormat"]');
const footerYear = document.querySelector('#footer-year');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

const timeUnits = ['hour', 'minute', 'second'];
const areas = {};
const theme = localStorage.getItem('xuan-theme');
let timeFormat = localStorage.getItem('xuan-time-format');

function dark() {
  document.documentElement.classList.add('dark');
  localStorage.setItem('xuan-theme', 'dark');
}

function light() {
  document.documentElement.classList.remove('dark');
  localStorage.setItem('xuan-theme', 'light');
}

function formatTwoDigits(num) {
  return String(num).padStart(2, '0');
}

timeUnits.forEach((unit) => {
  const item = document.createElement('div');
  item.classList.add('item');
  item.setAttribute('data-unit', unit);

  ['top.after', 'bottom.before', 'top.before', 'bottom.after'].forEach((it) => {
    const div = document.createElement('div');
    div.className = it.replace('.', ' ');
    item.appendChild(div);
  });

  clock.appendChild(item);
  areas[unit] = item;
});

function updateTime(target, value, maxValue) {
  const nextValue = value === maxValue ? 0 : value + 1;

  if (timeFormat === '12' && target.dataset.unit === 'hour') {
    const displayHour = value % 12 === 0 ? 12 : value % 12;
    const nextDisplayHour = nextValue % 12 === 0 ? 12 : nextValue % 12;
    const ampm = value >= 12 ? 'PM' : 'AM';
    const nextAmpm = nextValue >= 12 ? 'PM' : 'AM';

    target.querySelectorAll('.before').forEach((it) => {
      it.innerText = formatTwoDigits(displayHour);
    });
    target.querySelectorAll('.after').forEach((it) => {
      it.innerText = formatTwoDigits(nextDisplayHour);
    });
    target.querySelector('.bottom.before').innerHTML = `${formatTwoDigits(
      displayHour,
    )}<span class="ampm">${ampm}</span>`;
    target.querySelector('.bottom.after').innerHTML = `${formatTwoDigits(
      nextDisplayHour,
    )}<span class="ampm">${nextAmpm}</span>`;

    return;
  }

  target.querySelectorAll('.before').forEach((it) => {
    it.innerText = formatTwoDigits(value);
  });
  target.querySelectorAll('.after').forEach((it) => {
    it.innerText = formatTwoDigits(nextValue);
  });
}

function triggerFlip(target) {
  const topBefore = target.querySelector('.top.before');
  const bottomAfter = target.querySelector('.bottom.after');

  topBefore.style.animation = bottomAfter.style.animation = 'none';

  void topBefore.offsetWidth;

  topBefore.style.animation = 'topRotate 1s linear';
  bottomAfter.style.animation = 'bottomRotate 1s linear';
}

const getCurrentTime = async () => {
  const now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();
  let currentSecond = now.getSeconds();

  date.innerText = now.toLocaleDateString('sv');

  updateTime(areas['hour'], currentHour, 23);
  updateTime(areas['minute'], currentMinute, 59);
  updateTime(areas['second'], currentSecond, 59);

  triggerFlip(areas['second']);

  if (currentSecond === 59) {
    triggerFlip(areas['minute']);
  }

  if (currentMinute === 59 && currentSecond === 59) {
    triggerFlip(areas['hour']);
  }
};

getCurrentTime();
setInterval(getCurrentTime, 1000);

if (!theme) {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    dark();
    themeToggle.value = 'dark';
  } else {
    light();
    themeToggle.value = 'light';
  }
} else {
  themeToggle.value = theme;
  if (theme === 'dark') {
    dark();
  } else {
    light();
  }
}

if (timeFormat) {
  timeFormatToggle.value = timeFormat;
} else {
  localStorage.setItem('xuan-time-format', timeFormatToggle.value);
}

themeToggle.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    dark();
  } else {
    light();
  }
});

timeFormatToggle.addEventListener('change', (e) => {
  timeFormat = e.target.value;
  localStorage.setItem('xuan-time-format', e.target.value);
});
