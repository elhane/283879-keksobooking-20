'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // отрисовка метки объявления
  function renderOfferPin(offerPin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = offerPin.author.avatar;
    pinElement.querySelector('img').alt = offerPin.offer.title;
    pinElement.style.left = (offerPin.location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (offerPin.location.y - PIN_HEIGHT) + 'px';

    pinElement.addEventListener('click', function () {
      window.map.closeCard();
      pinElement.classList.add('map__pin--active');
      window.map.insertCard(offerPin);
      document.addEventListener('keydown', window.map.mapCardEscPressHandler);
    });
    return pinElement;
  }

  window.pin = {
    render: renderOfferPin
  };
})();
