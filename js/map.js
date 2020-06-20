'use strict';

(function () {

  var KeyCode = {
    ENTER: 13,
    ESCAPE: 27
  };

  var mapPins = document.querySelector('.map__pins');
  var messageTemplate = document.querySelector('#error').content.querySelector('.error');

  var successHandler = function (offers) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      if (offers[i].offer) {
        fragment.appendChild(window.pin.render(offers[i]));
      }
    }
    mapPins.appendChild(fragment);
  };

  function errorHandler(errorMessage) {
    var message = messageTemplate.cloneNode(true);
    var messageText = message.querySelector('.error__message');
    messageText.textContent = errorMessage;

    document.querySelector('main').appendChild(message);

    var errorButton = message.querySelector('.error__button');
    errorButton.addEventListener('click', errorButtonClickHandler);
    document.addEventListener('keydown', errorButtonEscPressHandler);
    document.addEventListener('click', windowClickHandler);
  }

  function errorButtonClickHandler() {
    document.querySelector('div.error').remove();
  }

  function errorButtonEscPressHandler(evt) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      document.querySelector('div.error').remove();
    }
  }

  function windowClickHandler(evt) {
    if (evt.target === document.querySelector('div.error')) {
      evt.preventDefault();
      document.querySelector('div.error').remove();
    }
  }

  function closeCard() {
    var mapCard = document.querySelector('.map__card');
    var pinActive = document.querySelector('.map__pin--active');

    if (mapCard) {
      mapCard.remove();
      pinActive.classList.remove('map__pin--active');
    }

    document.removeEventListener('keydown', mapCardEscPressHandler);
  }

  function popupCloseMouseDownHandler(evt) {
    if (evt.which === 1) {
      closeCard();
    }
  }

  function mapCardEscPressHandler(evt) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      closeCard();
    }
  }

  window.map = {
    KeyCode: KeyCode,
    popupCloseMouseDownHandler: popupCloseMouseDownHandler,
    mapCardEscPressHandler: mapCardEscPressHandler,
    successHandler: successHandler,
    errorHandler: errorHandler,
    closeCard: closeCard,
  };
})();
