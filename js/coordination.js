'use strict';

(function () {
  var PIN_MAIN_AFTER_HEIGHT = 22;

  var mapPinMain = document.querySelector('.map__pin--main');

  function getPinPosition(isActiveMode) {
    var positionX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
    var positionY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);

    if (isActiveMode) {
      positionY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight + PIN_MAIN_AFTER_HEIGHT);
    }
    return positionX + ', ' + positionY;
  }

  var pinCoordslimits = {
    left: window.data.locationXMin - mapPinMain.offsetWidth / 2,
    right: window.data.locationXMax - mapPinMain.offsetWidth / 2,
    top: window.data.locationYMin - mapPinMain.offsetHeight - PIN_MAIN_AFTER_HEIGHT,
    bottom: window.data.locationYMax - mapPinMain.offsetHeight - PIN_MAIN_AFTER_HEIGHT
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

  function mapPinMainKeyDownHandler(evt) {
    if (evt.keyCode === window.map.KeyCode.ENTER) {
      window.form.enableActiveMode();
    }
  }

  mapPinMain.addEventListener('keydown', mapPinMainKeyDownHandler);

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (evt.which === 1) {
      window.form.enableActiveMode();
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mapPinMainMouseMoveHandler = function (moveEvt) {
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
    };

    var mapPinMainMouseUpHandler = function () {

      document.removeEventListener('mousemove', mapPinMainMouseMoveHandler);
      document.removeEventListener('mouseup', mapPinMainMouseUpHandler);
    };

    document.addEventListener('mousemove', mapPinMainMouseMoveHandler);
    document.addEventListener('mouseup', mapPinMainMouseUpHandler);
  });

  window.coordination = {
    getPinPosition: getPinPosition
  };
})();
