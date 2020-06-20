'use strict';

(function () {

  var RoomsMinPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var mapBlock = document.querySelector('.map');
  var filterBlock = document.querySelector('.map__filters-container');
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

  function disableActiveMode() {
    mapBlock.classList.add('map--faded');
    mapAdForm.classList.add('ad-form--disabled');
    mapFiltersForm.setAttribute('disabled', 'disabled');
    window.coordination.setPinPosition(false);
    disableElements(mapAdFormFieldsets);
    disableElements(mapFiltersFormFieldsets);
  }

  disableActiveMode();

  // активировать страницу
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
    window.load(window.map.successHandler, window.map.errorHandler);
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

  window.form = {
    enableActiveMode: enableActiveMode,
    insertCard: function (offerPin) {
      filterBlock.before(window.card.render(offerPin));
    }
  };
})();
