'use strict';

(function () {

  var MENU_HEIGHT = 46;
  var AVATAR_LINK = 'img/avatars/user0';
  var AVATAR_IMG_EXTENSION = '.png';
  var OFFER_AMOUNT = 8;
  var OFFER_PRICE_MIN = 1;
  var OFFER_PRICE_MAX = 1000000;
  var OFFER_GUESTS_MIN = 0;
  var OFFER_GUESTS_MAX = 2;
  var OFFER_ROOMS = [1, 2, 3, 100];
  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
  var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];


  var OFFER_TITLES = [
    'Уютно и недорого!',
    'Элегантная квартира в неброских тонах',
    'Очень выгодное предложение!',
    'Эксклюзивный объект в этом районе'];

  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var locationXMax = document.querySelector('.map__overlay').offsetWidth;

  // получение случайного числа
  function getRandomNumber(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  // получение случайного элемента массива
  function getRandomElement(elements) {
    var randomIndex = getRandomNumber(0, elements.length - 1);
    return elements[randomIndex];
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

  // получение массива случайной длины Вариант-2)
  function getRandomLength(elements) {
    var shuffledElements = shuffleElements(elements);
    return shuffledElements.slice(0, getRandomNumber(1, elements.length - 1));
  }

  // создание объявления со случайными параметрамим
  function createOffer(count) {
    var locationX = getRandomNumber(LOCATION_X_MIN, locationXMax);
    var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX - MENU_HEIGHT);

    return {
      author: {
        avatar: AVATAR_LINK + (count + 1) + AVATAR_IMG_EXTENSION
      },
      offer: {
        title: getRandomElement(OFFER_TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: (getRandomElement(OFFER_TYPES)),
        rooms: getRandomElement(OFFER_ROOMS),
        guests: getRandomNumber(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
        checkin: getRandomElement(OFFER_CHECKINS),
        checkout: getRandomElement(OFFER_CHECKOUTS),
        features: getRandomLength(OFFER_FEATURES),
        description: 'Описание объявления',
        photos: getRandomLength(OFFER_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  // генерация массива объявлений
  function generateOffers(count) {
    var offers = [];
    for (var i = 0; i < count; i++) {
      offers.push(createOffer(i));
    }
    return offers;
  }

  // генерация объявлений
  var offers = generateOffers(OFFER_AMOUNT);

  window.data = {
    locationYMin: LOCATION_Y_MIN,
    locationYMax: LOCATION_Y_MAX,
    locationXMin: LOCATION_X_MIN,
    locationXMax: locationXMax,
    offers: offers
  };
})();
