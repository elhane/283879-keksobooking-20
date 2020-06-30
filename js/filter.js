'use strict';

(function () {

  var housingTypeSelect = document.querySelector('#housing-type');
  var housingRoomSelect = document.querySelector('#housing-rooms');
  var housingPriceSelect = document.querySelector('#housing-price');
  var housingGuestSelect = document.querySelector('#housing-guests');

  var FILTER_SELECT_DEFAULT_VALUE = 'any';

  var priceValues = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };

  window.form.mapFilters.addEventListener('change', window.debounce(function () {
    window.map.closeCard();
    window.form.removeOfferPins();
    updatePins();
  }));

  function filterByCount(elements, callback, count) {
    var filteredOffers = [];

    for (var i = 0; i < elements.length; i++) {
      if (callback(elements[i])) {
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

  function checkByRooms(item) {
    return housingRoomSelect.value === String(item.offer.rooms) || housingRoomSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkByGuests(item) {
    return housingGuestSelect.value === String(item.offer.guests) || housingGuestSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkByPrice(item) {
    if (housingPriceSelect.value !== FILTER_SELECT_DEFAULT_VALUE) {
      return item.offer.price >= priceValues[housingPriceSelect.value].min && item.offer.price <= priceValues[housingPriceSelect.value].max;
    } else {
      return FILTER_SELECT_DEFAULT_VALUE;
    }
  }

  function checkFeatures(item) {
    var checkedFeatures = Array.from(window.form.mapFilters.querySelectorAll('[type="checkbox"]:checked'));

    return checkedFeatures.every(function (feature) {
      return item.offer.features.includes(feature.value, 0);
    });
  }

  function callFilters(item) {
    return filters.every(function (callback) {
      return callback(item);
    });
  }

  var filters = [checkByType, checkByRooms, checkByGuests, checkByPrice, checkFeatures];

  function updatePins() {
    window.map.insertPins(filterByCount(window.data.offersToFilter, callFilters, window.map.offerAmount));
  }

  window.filter = {
    updatePins: updatePins
  };
})();
