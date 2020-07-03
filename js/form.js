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
  var mapAdForm = document.querySelector('.ad-form');
  var mapAdFormFieldsets = mapAdForm.querySelectorAll('input, select, fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFormFieldsets = mapFiltersForm.querySelectorAll('input, select, fieldset');
  var mapAdFormRoomsSelect = mapAdForm.querySelector('select[name="rooms"]');
  var mapAdFormCapacitySelect = mapAdForm.querySelector('select[name="capacity"]');
  var mapAdFormTitle = mapAdForm.querySelector('input[name="title"]');
  var mapAdFormRoomType = mapAdForm.querySelector('select[name="type"]');
  var mapAdFormPrice = mapAdForm.querySelector('input[name="price"]');
  var mapAdFormTimeIn = mapAdForm.querySelector('select[name="timein"]');
  var mapAdFormTimeOut = mapAdForm.querySelector('select[name="timeout"]');
  var mapAdFormSubmitButton = mapAdForm.querySelector('.ad-form__submit');

  function roomsSelecInputHandler() {
    switch (true) {
      case (mapAdFormRoomsSelect.value === '100' && mapAdFormCapacitySelect.value !== '0'):
        mapAdFormRoomsSelect.setCustomValidity('Для выбранного количества комнат размещение гостей невозможно');
        break;

      case (mapAdFormRoomsSelect.value !== '100' && mapAdFormCapacitySelect.value === '0'):
        mapAdFormRoomsSelect.setCustomValidity('Выберите количество гостей');
        break;

      case (mapAdFormCapacitySelect.value > mapAdFormRoomsSelect.value && mapAdFormCapacitySelect.value !== '0'):
        mapAdFormRoomsSelect.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
        break;

      default:
        mapAdFormRoomsSelect.setCustomValidity('');
    }
  }

  function titleInputHandler() {
    switch (true) {
      case (mapAdFormTitle.validity.tooShort):
        mapAdFormTitle.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
        break;

      case (mapAdFormTitle.validity.tooLong):
        mapAdFormTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
        break;

      case (mapAdFormTitle.validity.valueMissing):
        mapAdFormTitle.setCustomValidity('Обязательное поле');
        break;

      default:
        mapAdFormTitle.setCustomValidity('');
    }
  }

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

  function removeOfferPins() {
    var offerPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < offerPins.length; i++) {
      offerPins[i].remove();
    }
  }

  function disableActiveMode() {
    mapBlock.classList.add('map--faded');
    mapAdForm.classList.add('ad-form--disabled');
    window.map.filterBlock.classList.add('hidden');
    mapFiltersForm.setAttribute('disabled', 'disabled');
    mapAdForm.reset();
    window.coordination.mapPinMain.style.left = PIN_START_COORD_X;
    window.coordination.mapPinMain.style.top = PIN_START_COORD_Y;
    window.map.closeCard();
    removeOfferPins();
    window.coordination.mapPinMain.addEventListener('mousedown', window.coordination.mapPinMainMouseDownHandler);
    window.coordination.setPinPosition(false);
    disableElements(mapAdFormFieldsets);
    disableElements(mapFiltersFormFieldsets);
    mapAdFormSubmitButton.removeEventListener('click', mapAdFormSubmitButtonClickHandler);
  }

  disableActiveMode();

  function enableActiveMode() {
    mapBlock.classList.remove('map--faded');
    mapAdForm.classList.remove('ad-form--disabled');
    mapFiltersForm.removeAttribute('disabled');
    window.coordination.disableAdressInput();
    mapAdFormTitle.addEventListener('input', titleInputHandler);
    mapAdFormRoomType.addEventListener('input', roomTypeInputHandler);
    mapAdFormRoomsSelect.addEventListener('input', roomsSelecInputHandler);
    mapAdFormCapacitySelect.addEventListener('input', roomsSelecInputHandler);
    mapAdFormTimeIn.addEventListener('input', timeInInputHandler);
    mapAdFormTimeOut.addEventListener('input', timeOutInputHandler);
    enableElements(mapAdFormFieldsets);
    enableElements(mapFiltersFormFieldsets);
    mapAdFormSubmitButton.addEventListener('click', mapAdFormSubmitButtonClickHandler);
    window.photo.avatarChooser.addEventListener('change', window.photo.avatarUploadHandler);
    window.photo.housingPhotoChooser.addEventListener('change', window.photo.housingPhotoUploadHandler);
    window.backend.loadData(window.map.successLoadHandler, window.map.errorLoadHandler);
  }

  function roomTypeInputHandler() {
    mapAdFormPrice.min = RoomsMinPrice[(mapAdFormRoomType.value).toUpperCase()];
    mapAdFormPrice.placeholder = RoomsMinPrice[(mapAdFormRoomType.value).toUpperCase()];
  }

  function timeInInputHandler() {
    mapAdFormTimeOut.value = mapAdFormTimeIn.value;
  }

  function timeOutInputHandler() {
    mapAdFormTimeIn.value = mapAdFormTimeOut.value;
  }

  var messageSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var resetButton = document.querySelector('.ad-form__reset');

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
    window.backend.uploadData(new FormData(mapAdForm), successUploadHandler, window.map.errorLoadHandler);
    evt.preventDefault();
    disableActiveMode();
    window.photo.resetPhotosInputs();
  }

  function resetButtonClickHandler() {
    disableActiveMode();
    window.photo.resetPhotosInputs();
  }

  mapAdForm.addEventListener('submit', submitHandler);
  resetButton.addEventListener('click', resetButtonClickHandler);

  function validateFormInputs(formInputs) {
    formInputs.forEach(function (item) {
      if (!item.validity.valid) {
        item.classList.add('form-error');
      } else {
        item.classList.remove('form-error');
      }
    });
  }

  function mapAdFormSubmitButtonClickHandler() {
    validateFormInputs(mapAdForm.querySelectorAll('input, select'));
  }

  window.form = {
    enableActiveMode: enableActiveMode,
    disableActiveMode: disableActiveMode,
    enableElements: enableElements,
    removeOfferPins: removeOfferPins,
    mapFilters: mapFiltersForm
  };
})();
