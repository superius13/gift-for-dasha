(function () {
  'use strict';

  // =====================================================
  // АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ ТЕМ ПО ДАТЕ
  // =====================================================
  var THEMES = {
    march8: {
      // Активна с 6 по 10 марта
      isActive: function () {
        var now = new Date();
        var m = now.getMonth() + 1;
        var d = now.getDate();
        return m === 3 && d >= 8 && d <= 10;
      },
      floatSymbols: ['🌸', '🌷', '🌼', '🌺', '✿'],
      floatCount: 50,
      apply: function () {
        document.documentElement.classList.add('theme-march8');
        var step1Text = document.querySelector('.step-1-text');
        if (step1Text) step1Text.textContent = 'С 8 марта, Дашуль! У меня для тебя кое-что есть 🌸';
        var header = document.querySelector('.letter-header');
        if (header) {
          var badge = document.createElement('div');
          badge.className = 'spring-badge';
          badge.textContent = '🌸 8 марта 🌸';
          header.insertBefore(badge, header.firstChild);
        }
        var label = document.querySelector('.label');
        if (label) label.textContent = 'С праздником, Дашуль';
        var message = document.querySelector('.message');
        if (message) {
          var greeting = document.createElement('p');
          greeting.textContent = 'Сегодня 8 марта - и я хочу, чтобы ты знала: ты самое прекрасное, что есть в моей жизни.';
          message.insertBefore(greeting, message.firstChild);
        }
        var sig = document.querySelector('.signature');
        if (sig) sig.textContent = 'Целую. С любовью, твой Женя 🌷';
        var sigDate = document.querySelector('.signature-date');
        if (sigDate) sigDate.textContent = '8 марта 2026';
        var easter = document.getElementById('heart-easter-popup');
        if (easter) easter.textContent = 'С 8 марта, родная 🌸';
      }
    }
  };

  // Применяем активную тему (если есть)
  var activeTheme = null;
  Object.keys(THEMES).forEach(function (key) {
    if (THEMES[key].isActive()) activeTheme = THEMES[key];
  });
  if (activeTheme) activeTheme.apply();

  // =====================================================
  // Переключение шагов (кнопка «Хочу посмотреть» и гифка «Да»)
  // =====================================================
  var STORAGE_KEY = 'gift-letter-opens';

  function goToStep(nextStep) {
    var current = document.querySelector('.step.is-visible');
    var next = document.querySelector('.step[data-step="' + nextStep + '"]');
    if (current && next) {
      current.classList.remove('is-visible');
      next.classList.add('is-visible');
      if (nextStep === '3') {
        var n = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) + 1;
        localStorage.setItem(STORAGE_KEY, String(n));
        var el = document.getElementById('letter-opens');
        if (el) {
          var word = (n % 10 === 1 && n % 100 !== 11) ? 'раз' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'раза' : 'раз';
          el.textContent = 'Ты открыла это письмо ' + n + ' ' + word;
        }
        if (activeTheme) launchConfetti();
      }
    }
  }

  function launchConfetti() {
    var petals = ['🌸', '🌷', '🌼', '🌺', '✿'];
    for (var i = 0; i < 32; i++) {
      (function () {
        var petal = document.createElement('span');
        petal.className = 'confetti-petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = (Math.random() * 100) + 'vw';
        petal.style.animationDelay = (Math.random() * 1.8) + 's';
        petal.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
        document.body.appendChild(petal);
        setTimeout(function () { petal.remove(); }, 5500);
      })();
    }
  }

  document.querySelectorAll('[data-next]').forEach(function (el) {
    el.addEventListener('click', function () {
      goToStep(this.getAttribute('data-next'));
    });
  });

  var btnBack = document.getElementById('btn-back-to-envelope');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      goToStep('1');
    });
  }

  // Гифка «Нет» — показываем реакцию и прячем выбор ДА/НЕТ
  var gifNo = document.querySelector('.gif-no[data-show]');
  var noReactionId = gifNo && gifNo.getAttribute('data-show');
  if (noReactionId) {
    var noReactionBlock = document.getElementById(noReactionId);
    var gifsWrap = document.querySelector('.step-2-gifs');
    gifNo.addEventListener('click', function () {
      if (noReactionBlock && gifsWrap) {
        noReactionBlock.classList.remove('is-hidden');
        noReactionBlock.setAttribute('aria-hidden', 'false');
        gifsWrap.classList.add('is-hidden');
        var reactionVideo = noReactionBlock.querySelector('video');
        if (reactionVideo) {
          reactionVideo.currentTime = 0;
          reactionVideo.play();
        }
      }
    });

    var btnTryAgain = document.getElementById('btn-try-again');
    if (btnTryAgain) {
      btnTryAgain.addEventListener('click', function () {
        if (noReactionBlock && gifsWrap) {
          noReactionBlock.classList.add('is-hidden');
          noReactionBlock.setAttribute('aria-hidden', 'true');
          gifsWrap.classList.remove('is-hidden');
        }
      });
    }
  }

  // Пасхалка: двойной клик или долгое нажатие по сердечку в письме
  var letterHeart = document.getElementById('letter-heart');
  var easterPopup = document.getElementById('heart-easter-popup');
  if (letterHeart && easterPopup) {
    var easterHideTimer;

    function showEaster() {
      easterPopup.classList.remove('is-hidden');
      easterPopup.setAttribute('aria-hidden', 'false');
      clearTimeout(easterHideTimer);
      easterHideTimer = setTimeout(function () {
        easterPopup.classList.add('is-hidden');
        easterPopup.setAttribute('aria-hidden', 'true');
      }, 2500);
    }

    letterHeart.addEventListener('click', function (e) {
      e.preventDefault();
      showEaster();
    });
  }

  // Рисуем символы на фоне (сердечки или цветочки — зависит от темы)
  var container = document.querySelector('.hearts');
  if (container) {
    var symbols = (activeTheme && activeTheme.floatSymbols) ? activeTheme.floatSymbols : ['♥'];
    var count = (activeTheme && activeTheme.floatCount) ? activeTheme.floatCount : 28;
    for (var i = 0; i < count; i++) {
      var heart = document.createElement('span');
      heart.className = 'heart-float';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.animationDelay = (Math.random() * 5) + 's';
      heart.style.fontSize = (0.65 + Math.random() * 0.5) + 'rem';
      container.appendChild(heart);
    }
  }

  // Если есть photo.png — показываем его
  var placeholder = document.querySelector('.photo-placeholder');
  if (placeholder) {
    var img = new Image();
    img.onload = function () {
      placeholder.classList.add('has-photo');
      placeholder.innerHTML = '';
      placeholder.appendChild(img);
    };
    img.alt = 'Love is...';
    img.src = 'photo.png';
  }
})();
