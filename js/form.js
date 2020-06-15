'use strict';

(function () {

  var mapBlock = document.querySelector('.map');
  var mapPinMain = mapBlock.querySelector('.map__pin--main');
  var mapAdForm = document.querySelector('.ad-form');
  var mapAdFormFieldsets = mapAdForm.querySelectorAll('input, select, fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFormFieldsets = mapFiltersForm.querySelectorAll('input, select, fieldset');
  var mapAddressInput = mapAdForm.querySelector('#address');
  var mapAdFormRoomsSelect = mapAdForm.querySelector('select[name="rooms"]');
  var mapAdFormCapacitySelect = mapAdForm.querySelector('select[name="capacity"]');
  var mapAdFormTitle = mapAdForm.querySelector('input[name="title"]');
  var mapAdFormRoomType = mapAdForm.querySelector('select[name="type"]');
  var mapAdFormPrice = mapAdForm.querySelector('input[name="price"]');
  var mapAdFormTimeIn = mapAdForm.querySelector('select[name="timein"]');
  var mapAdFormTimeOut = mapAdForm.querySelector('select[name="timeout"]');
  var filterBlock = document.querySelector('.map__filters-container');

  function getPinPosition(isActiveMode) {
    var positionX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
    var positionY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);

    if (isActiveMode) {
      positionY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight + window.data.PIN_MAIN_AFTER_HEIGHT);
    }
    return positionX + ', ' + positionY;
  }

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

  function roomTypeInputHandler() {
    mapAdFormPrice.min = window.data.RoomsMinPrice[(mapAdFormRoomType.value).toUpperCase()];
    mapAdFormPrice.placeholder = window.data.RoomsMinPrice[(mapAdFormRoomType.value).toUpperCase()];
  }

  function timeInInputHandler() {
    mapAdFormTimeOut.value = mapAdFormTimeIn.value;
  }

  function timeOutInputHandler() {
    mapAdFormTimeIn.value = mapAdFormTimeOut.value;
  }

  function validateForm() {
    mapAdFormTitle.addEventListener('input', titleInputHandler);
    mapAdFormRoomType.addEventListener('input', roomTypeInputHandler);
    mapAdFormRoomsSelect.addEventListener('input', roomsSelecInputHandler);
    mapAdFormCapacitySelect.addEventListener('input', roomsSelecInputHandler);
    mapAdFormTimeIn.addEventListener('input', timeInInputHandler);
    mapAdFormTimeOut.addEventListener('input', timeOutInputHandler);
  }

  window.form = {
    mapBlock: mapBlock,
    mapPinMain: mapPinMain,
    mapAdForm: mapAdForm,
    mapFiltersForm: mapFiltersForm,
    mapAddressInput: mapAddressInput,
    mapAdFormFieldsets: mapAdFormFieldsets,
    mapFiltersFormFieldsets: mapFiltersFormFieldsets,
    getPinPosition: getPinPosition,
    validateForm: validateForm,
    filterBlock: filterBlock
  };
})();
