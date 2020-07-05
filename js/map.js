'use strict';

(function () {
  var KeyCode = {
    ENTER: 13,
    ESCAPE: 27
  };

  var mapPins = document.querySelector('.map__pins');
  var messageErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var filterBlock = document.querySelector('.map__filters-container');

  function insertPins(elements) {
    var fragment = document.createDocumentFragment();

    elements.forEach(function (element) {
      if (element.offer) {
        fragment.appendChild(window.pin.render(element));
      }
    });
    mapPins.appendChild(fragment);
  }

  function successLoadHandler(offers) {
    window.map.offersToFilter = offers;
    window.filter.updatePins();
    filterBlock.classList.remove('hidden');
  }

  function errorLoadHandler(errorMessage) {
    var message = messageErrorTemplate.cloneNode(true);
    var messageText = message.querySelector('.error__message');
    messageText.textContent = errorMessage;

    document.querySelector('main').appendChild(message);

    var errorButton = message.querySelector('.error__button');
    errorButton.addEventListener('click', errorButtonClickHandler);
    document.addEventListener('keydown', errorMessageEscPressHandler);
    document.addEventListener('click', windowErrorClickHandler);
  }

  function removeErrorMessageBlock() {
    document.querySelector('div.error').remove();
  }

  function errorButtonClickHandler() {
    removeErrorMessageBlock();
  }

  function errorMessageEscPressHandler(evt) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      removeErrorMessageBlock();
    }
  }

  function windowErrorClickHandler(evt) {
    if (evt.target.matches('div.error')) {
      evt.preventDefault();
      removeErrorMessageBlock();
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
    cardEscPressHandler: mapCardEscPressHandler,
    successLoadHandler: successLoadHandler,
    errorLoadHandler: errorLoadHandler,
    closeCard: closeCard,
    filterBlock: filterBlock,
    insertCard: function (offerPin) {
      filterBlock.before(window.card.render(offerPin));
    },
    insertPins: insertPins,
    offersToFilter: []
  };
})();
