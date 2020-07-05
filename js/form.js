'use strict';

(function () {
  var PIN_START_COORD_X = '570px';
  var PIN_START_COORD_Y = '375px';

  var RoomsMinPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var mapBlock = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('input, select, fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFormFieldsets = mapFiltersForm.querySelectorAll('input, select, fieldset');
  var adFormRoomsSelect = adForm.querySelector('select[name="rooms"]');
  var adFormCapacitySelect = adForm.querySelector('select[name="capacity"]');
  var adFormTitle = adForm.querySelector('input[name="title"]');
  var adFormRoomType = adForm.querySelector('select[name="type"]');
  var adFormPrice = adForm.querySelector('input[name="price"]');
  var adFormTimeIn = adForm.querySelector('select[name="timein"]');
  var adFormTimeOut = adForm.querySelector('select[name="timeout"]');
  var adFormSubmitButton = adForm.querySelector('.ad-form__submit');
  var adFormInputs = adForm.querySelectorAll('input, select');
  var messageSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var resetButton = document.querySelector('.ad-form__reset');

  function roomsSelecInputHandler() {
    switch (true) {
      case (adFormRoomsSelect.value === '100' && adFormCapacitySelect.value !== '0'):
        adFormRoomsSelect.setCustomValidity('Для выбранного количества комнат размещение гостей невозможно');
        break;

      case (adFormRoomsSelect.value !== '100' && adFormCapacitySelect.value === '0'):
        adFormRoomsSelect.setCustomValidity('Выберите количество гостей');
        break;

      case (adFormCapacitySelect.value > adFormRoomsSelect.value && adFormCapacitySelect.value !== '0'):
        adFormRoomsSelect.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
        break;

      default:
        adFormRoomsSelect.setCustomValidity('');
    }
  }

  function titleInputHandler() {
    switch (true) {
      case (adFormTitle.validity.tooShort):
        adFormTitle.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
        break;

      case (adFormTitle.validity.tooLong):
        adFormTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
        break;

      case (adFormTitle.validity.valueMissing):
        adFormTitle.setCustomValidity('Обязательное поле');
        break;

      default:
        adFormTitle.setCustomValidity('');
    }
  }

  function disableElements(elements, isDisabled) {
    elements.forEach(function (element) {
      element.disabled = isDisabled;
    });
  }

  function removeOfferPins() {
    var offerPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    offerPins.forEach(function (element) {
      element.remove();
    });

  }

  function disableActiveMode() {
    mapBlock.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    window.map.filterBlock.classList.add('hidden');
    mapFiltersForm.setAttribute('disabled', 'disabled');
    adForm.reset();
    window.coordination.mapPinMain.style.left = PIN_START_COORD_X;
    window.coordination.mapPinMain.style.top = PIN_START_COORD_Y;
    window.map.closeCard();
    removeOfferPins();
    window.coordination.mapPinMain.addEventListener('mousedown', window.coordination.mapPinMainMouseDownHandler);
    window.coordination.setPinPosition(false);
    disableElements(adFormFieldsets, true);
    disableElements(mapFiltersFormFieldsets, true);
    adFormSubmitButton.removeEventListener('click', adFormSubmitButtonClickHandler);
  }

  disableActiveMode();

  function enableActiveMode() {
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFiltersForm.removeAttribute('disabled');
    window.coordination.disableAdressInput();
    adFormTitle.addEventListener('input', titleInputHandler);
    adFormRoomType.addEventListener('input', roomTypeInputHandler);
    adFormRoomsSelect.addEventListener('input', roomsSelecInputHandler);
    adFormCapacitySelect.addEventListener('input', roomsSelecInputHandler);
    adFormTimeIn.addEventListener('input', timeInInputHandler);
    adFormTimeOut.addEventListener('input', timeOutInputHandler);
    disableElements(adFormFieldsets, false);
    disableElements(mapFiltersFormFieldsets, false);
    adFormSubmitButton.addEventListener('click', adFormSubmitButtonClickHandler);
    window.preview.addPhotosUploadListeners();
    window.backend.loadData(window.map.successLoadHandler, window.map.errorLoadHandler);
  }

  function roomTypeInputHandler() {
    adFormPrice.min = RoomsMinPrice[(adFormRoomType.value).toUpperCase()];
    adFormPrice.placeholder = RoomsMinPrice[(adFormRoomType.value).toUpperCase()];
  }

  function timeInInputHandler() {
    adFormTimeOut.value = adFormTimeIn.value;
  }

  function timeOutInputHandler() {
    adFormTimeIn.value = adFormTimeOut.value;
  }

  function removeSuccessMessageBlock() {
    document.querySelector('div.success').remove();
  }

  function successMessageEscPressHandler(evt) {
    if (evt.keyCode === window.map.KeyCode.ESCAPE) {
      evt.preventDefault();
      removeSuccessMessageBlock();
    }
  }

  function windowSuccessClickHandler(evt) {
    if (evt.target.matches('div.success')) {
      evt.preventDefault();
      removeSuccessMessageBlock();
    }
  }

  function successUploadHandler() {
    var message = messageSuccessTemplate.cloneNode(true);
    document.querySelector('main').appendChild(message);
    document.addEventListener('keydown', successMessageEscPressHandler);
    document.addEventListener('click', windowSuccessClickHandler);
  }

  function submitHandler(evt) {
    window.backend.uploadData(new FormData(adForm), successUploadHandler, window.map.errorLoadHandler);
    evt.preventDefault();
    disableActiveMode();
    window.preview.resetPhotosInputs();
  }

  function resetButtonClickHandler() {
    disableActiveMode();
    window.preview.resetPhotosInputs();
  }

  adForm.addEventListener('submit', submitHandler);
  resetButton.addEventListener('click', resetButtonClickHandler);

  function validateFormInputs(formInputs) {
    formInputs.forEach(function (element) {
      element.classList.toggle('form-error', !element.validity.valid);
    });
  }

  function adFormSubmitButtonClickHandler() {
    validateFormInputs(adFormInputs);
  }

  window.form = {
    enableActiveMode: enableActiveMode,
    disableActiveMode: disableActiveMode,
    removeOfferPins: removeOfferPins,
    mapFilters: mapFiltersForm
  };
})();
