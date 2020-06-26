'use strict';

(function () {
  var offersToFilter = [];

  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var locationXMax = document.querySelector('.map__overlay').offsetWidth;

  // получение случайного числа
  function getRandomNumber(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  // перемешивание массива
  function shuffleElements(elements) {
    var mixedElements = elements.slice();
    for (var i = mixedElements.length - 1; i > 0; i--) {
      var j = getRandomNumber(0, mixedElements.length - 1);
      var swap = mixedElements[i];
      mixedElements[i] = mixedElements[j];
      mixedElements[j] = swap;
    }
    return mixedElements;
  }

  window.data = {
    locationYMin: LOCATION_Y_MIN,
    locationYMax: LOCATION_Y_MAX,
    locationXMin: LOCATION_X_MIN,
    locationXMax: locationXMax,
    offersToFilter: offersToFilter,
    shuffleElements: shuffleElements
  };
})();
