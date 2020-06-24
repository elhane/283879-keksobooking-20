'use strict';

(function () {

  var housingTypeSelect = document.querySelector('#housing-type');
  var anyHousingTypeValue = housingTypeSelect.value; // 'any'

  housingTypeSelect.addEventListener('change', function () {

    window.form.removeOfferPins();
    window.map.closeCard();
    updatePins();
  });


  function updatePins() {
    window.data.filteredOffers = window.data.offersToFilter.filter(function (item) {
      return (housingTypeSelect.value !== anyHousingTypeValue) ? housingTypeSelect.value === item.offer.type : item.offer.type;
    }).slice(0, window.map.offerAmount);

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.filteredOffers.length; i++) {
      if (window.data.filteredOffers[i].offer) {
        fragment.appendChild(window.pin.render(window.data.filteredOffers[i]));
      }
    }
    window.map.pinsBlock.appendChild(fragment);
  }

})();
