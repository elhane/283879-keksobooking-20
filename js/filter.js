'use strict';

(function () {
  var FILTER_SELECT_DEFAULT_VALUE = 'any';
  var OFFER_AMOUNT = 5;

  var mapFiltersForm = document.querySelector('.map__filters');
  var housingTypeSelect = document.querySelector('#housing-type');
  var housingRoomSelect = document.querySelector('#housing-rooms');
  var housingPriceSelect = document.querySelector('#housing-price');
  var housingGuestSelect = document.querySelector('#housing-guests');

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

  mapFiltersForm.addEventListener('change', window.debounce(function () {
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

  function checkByType(element) {
    return housingTypeSelect.value === element.offer.type || housingTypeSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkByRooms(element) {
    return housingRoomSelect.value === String(element.offer.rooms) || housingRoomSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkByGuests(element) {
    return housingGuestSelect.value === String(element.offer.guests) || housingGuestSelect.value === FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkByPrice(element) {
    if (housingPriceSelect.value !== FILTER_SELECT_DEFAULT_VALUE) {
      return element.offer.price >= priceValues[housingPriceSelect.value].min && element.offer.price <= priceValues[housingPriceSelect.value].max;
    }
    return FILTER_SELECT_DEFAULT_VALUE;
  }

  function checkFeatures(element) {
    var checkedFeatures = Array.from(mapFiltersForm.querySelectorAll('[type="checkbox"]:checked'));

    return checkedFeatures.every(function (feature) {
      return element.offer.features.includes(feature.value, 0);
    });
  }

  function callFilters(element) {
    return filters.every(function (callback) {
      return callback(element);
    });
  }

  var filters = [checkByType, checkByRooms, checkByGuests, checkByPrice, checkFeatures];

  function updatePins() {
    window.map.insertPins(filterByCount(window.map.offersToFilter, callFilters, OFFER_AMOUNT));
  }

  window.filter = {
    updatePins: updatePins
  };
})();
