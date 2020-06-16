'use strict';

(function () {

  var KeyCode = {
    ENTER: 13,
    ESCAPE: 27
  };

  var mapPins = document.querySelector('.map__pins');

  // добавление меток объявлений
  function placeOffers(offers) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      if (offers[i].offer) {
        fragment.appendChild(window.pin.render(offers[i]));
      }
    }
    mapPins.appendChild(fragment);
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

  function mapPinMainMouseDownHandler(evt) {
    if (evt.which === 1) {
      window.form.enableActiveMode();
    }
  }

  function mapPinMainKeyDownHandler(evt) {
    if (evt.keyCode === KeyCode.ENTER) {
      window.form.enableActiveMode();
    }
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
    pinMainMouseDownHandler: mapPinMainMouseDownHandler,
    pinMainKeyDownHandler: mapPinMainKeyDownHandler,
    popupCloseMouseDownHandler: popupCloseMouseDownHandler,
    mapCardEscPressHandler: mapCardEscPressHandler,
    closeCard: closeCard,
    placeOffers: placeOffers
  };
})();
