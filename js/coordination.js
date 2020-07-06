'use strict';

(function () {
  var PIN_MAIN_AFTER_HEIGHT = 22;
  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var locationXMax = document.querySelector('.map__overlay').offsetWidth;
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapAddressInput = document.querySelector('#address');

  function setPinPosition(isActiveMode) {
    var positionX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
    var positionY = Math.round(mapPinMain.offsetTop + ((isActiveMode) ? (mapPinMain.offsetHeight + PIN_MAIN_AFTER_HEIGHT) : (mapPinMain.offsetHeight / 2)));

    mapAddressInput.value = positionX + ', ' + positionY;
  }

  function disableAdressInput() {
    mapAddressInput.setAttribute('readonly', 'readonly');
    mapAddressInput.classList.add('ad-form--disabled');
  }

  var pinCoordslimits = {
    left: LOCATION_X_MIN - mapPinMain.offsetWidth / 2,
    right: locationXMax - mapPinMain.offsetWidth / 2,
    top: LOCATION_Y_MIN - mapPinMain.offsetHeight - PIN_MAIN_AFTER_HEIGHT,
    bottom: LOCATION_Y_MAX - mapPinMain.offsetHeight - PIN_MAIN_AFTER_HEIGHT
  };

  function checkCoordsLimits() {
    if (mapPinMain.offsetLeft <= pinCoordslimits.left) {
      mapPinMain.style.left = pinCoordslimits.left + 'px';
    }
    if (mapPinMain.offsetLeft >= pinCoordslimits.right) {
      mapPinMain.style.left = pinCoordslimits.right + 'px';
    }
    if (mapPinMain.offsetTop <= pinCoordslimits.top) {
      mapPinMain.style.top = pinCoordslimits.top + 'px';
    }
    if (mapPinMain.offsetTop >= pinCoordslimits.bottom) {
      mapPinMain.style.top = pinCoordslimits.bottom + 'px';
    }
  }

  function mapPinMainKeyDownHandler() {
    if (window.util.isEnterPressed) {
      window.form.enableActiveMode();
    }
    mapPinMain.removeEventListener('keydown', mapPinMainKeyDownHandler);
    mapPinMain.removeEventListener('mousedown', mapPinMainMouseDownHandler);
  }

  function mapPinMainMouseDownHandler() {
    if (window.util.isLeftMouseDown) {
      window.form.enableActiveMode();
    }
    mapPinMain.removeEventListener('mousedown', mapPinMainMouseDownHandler);
    mapPinMain.removeEventListener('keydown', mapPinMainKeyDownHandler);
  }

  mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainKeyDownHandler);

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function mapPinMainMouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = mapPinMain.offsetTop - shift.y + 'px';
      mapPinMain.style.left = mapPinMain.offsetLeft - shift.x + 'px';

      checkCoordsLimits();
      setPinPosition(true);
    }

    function mapPinMainMouseUpHandler() {

      document.removeEventListener('mousemove', mapPinMainMouseMoveHandler);
      document.removeEventListener('mouseup', mapPinMainMouseUpHandler);
    }

    document.addEventListener('mousemove', mapPinMainMouseMoveHandler);
    document.addEventListener('mouseup', mapPinMainMouseUpHandler);
  });

  window.coordination = {
    setPinPosition: setPinPosition,
    disableAdressInput: disableAdressInput,
    mapPinMainMouseDownHandler: mapPinMainMouseDownHandler
  };
})();
