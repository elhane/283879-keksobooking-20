'use strict';

(function () {

  var mapPins = window.form.mapBlock.querySelector('.map__pins');

  var KeyCode = {
    ENTER: 13,
    ESCAPE: 27
  };

  function disableElements(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('disabled', 'disabled');
    }
  }

  function enableElements(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
  }

  function disableActiveMode() {
    window.form.mapBlock.classList.add('map--faded');
    window.form.mapAdForm.classList.add('ad-form--disabled');
    window.form.mapFiltersForm.setAttribute('disabled', 'disabled');
    window.form.mapAddressInput.value = window.form.getPinPosition(false);
    disableElements(window.form.mapAdFormFieldsets);
    disableElements(window.form.mapFiltersFormFieldsets);
  }

  disableActiveMode();

  // активировать страницу
  function enableActiveMode() {
    window.form.mapBlock.classList.remove('map--faded');
    window.form.mapAdForm.classList.remove('ad-form--disabled');
    window.form.mapFiltersForm.removeAttribute('disabled');
    window.form.mapAddressInput.value = window.form.getPinPosition(true);
    window.form.mapAddressInput.setAttribute('readonly', 'readonly');
    window.form.mapAddressInput.classList.add('ad-form--disabled');
    window.form.validateForm();
    enableElements(window.form.mapAdFormFieldsets);
    enableElements(window.form.mapFiltersFormFieldsets);
    placeOffers(window.data.offers);
  }

  // добавление меток объявлений
  function placeOffers(offers) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      if (offers[i].offer) {
        fragment.appendChild(window.pin.renderOfferPin(offers[i]));
      }
    }
    mapPins.appendChild(fragment);
  }

  function closeCard() {
    var mapCard = window.form.mapBlock.querySelector('.map__card');
    var pinActive = document.querySelector('.map__pin--active');

    if (mapCard) {
      mapCard.remove();
      pinActive.classList.remove('map__pin--active');
    }

    document.removeEventListener('keydown', mapCardEscPressHandler);
  }

  function mapPinMainMouseDownHandler(evt) {
    if (evt.which === 1) {
      enableActiveMode();
    }
  }

  function mapPinMainKeyDownHandler(evt) {
    if (evt.keyCode === KeyCode.ENTER) {
      enableActiveMode();
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

  window.form.mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
  window.form.mapPinMain.addEventListener('keydown', mapPinMainKeyDownHandler);

  window.map = {
    popupCloseMouseDownHandler: popupCloseMouseDownHandler,
    mapCardEscPressHandler: mapCardEscPressHandler,
    closeCard: closeCard
  };
})();
