(function () {
  'use strict';

  // Переключение шагов (кнопка «Хочу посмотреть» и гифка «Да»)
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
      }
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

    letterHeart.addEventListener('dblclick', function (e) {
      e.preventDefault();
      showEaster();
    });

    var longPressTimer;
    letterHeart.addEventListener('touchstart', function (e) {
      longPressTimer = setTimeout(function () {
        showEaster();
      }, 500);
    }, { passive: true });
    letterHeart.addEventListener('touchend', function () {
      clearTimeout(longPressTimer);
    }, { passive: true });
    letterHeart.addEventListener('touchcancel', function () {
      clearTimeout(longPressTimer);
    }, { passive: true });
  }

  // Рисуем сердечки на фоне (позиции в JS — тогда все точно видны)
  var container = document.querySelector('.hearts');
  if (container) {
    var count = 28;
    for (var i = 0; i < count; i++) {
      var heart = document.createElement('span');
      heart.className = 'heart-float';
      heart.textContent = '♥';
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
    img.alt = 'Love is... делать уютные селфи вдвоём';
    img.src = 'photo.png';
  }
})();
