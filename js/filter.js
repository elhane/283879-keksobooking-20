'use strict';

(function () {

  var housingTypeSelect = document.querySelector('#housing-type');
  var FILTER_SELECT_DEFAULT_VALUE = 'any';

  housingTypeSelect.addEventListener('change', function () {
    window.map.closeCard();
    window.form.removeOfferPins();
    updatePins();
  });

  function filterByCount(elements, cb, count) {
    var filteredOffers = [];

    for (var i = 0; i < elements.length; i++) {
      if (cb(elements[i])) {
        filteredOffers.push(elements[i]);
        if (filteredOffers.length === count) {
          break;
        }
      }
    }
    return filteredOffers;
  }

  function checkByType(item) {
    return housingTypeSelect.value === item.offer.type || housingTypeSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function updatePins() {
    window.map.insertPins(filterByCount(window.data.offersToFilter, checkByType, window.map.offerAmount));
  }
})();
