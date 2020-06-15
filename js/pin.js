'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // отрисовка метки объявления
  function renderOfferPin(offerPin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = offerPin.author.avatar;
    pinElement.querySelector('img').alt = offerPin.offer.title;
    pinElement.style.left = (offerPin.location.x - window.data.PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (offerPin.location.y - window.data.PIN_HEIGHT) + 'px';

    pinElement.addEventListener('click', function () {
      window.map.closeCard();
      pinElement.classList.add('map__pin--active');

      window.form.mapBlock.insertBefore(window.card.renderCard(offerPin), window.form.filterBlock);
      document.addEventListener('keydown', window.map.mapCardEscPressHandler);
    });
    return pinElement;
  }

  window.pin = {
    renderOfferPin: renderOfferPin
  };

})();
