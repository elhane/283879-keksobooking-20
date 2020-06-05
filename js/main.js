'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 60;
var MENU_HEIGHT = 46;

var AVATAR_LINK = 'img/avatars/user0';
var AVATAR_IMG_EXTENSION = '.png';

var OFFER_AMOUNT = 8;

var OFFER_PRICE_MIN = 1;
var OFFER_PRICE_MAX = 999999;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_ROOMS = [1, 2, 3];
var OFFER_GUESTS = [0, 1, 2];
var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var OFFER_TITLES = ['Уютно и недорого!', 'Элегантная квартира в неброских тонах', 'Очень выгодное предложение!', 'Эксклюзивный объект в этом районе'];

var LOCATION_X_MIN = 0;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

var locationXMax = document.querySelector('.map__overlay').offsetWidth;

// получение случайного числа
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// получение случайного элемента массива
var getRandomElement = function (elements) {
  var randomIndex = Math.floor(Math.random() * elements.length);
  return elements[randomIndex];
};

// перемешивание массива
var shuffleElements = function (elements) {
  var mixedElements = elements.slice();
  for (var i = mixedElements.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = mixedElements[i];
    mixedElements[i] = mixedElements[j];
    mixedElements[j] = swap;
  }
  return mixedElements;
};

// получение массива случайной длины
var getRandomLength = function (elements) {
  var elementsCopy = shuffleElements(elements); // скопировать перемешанный массив
  elementsCopy.length = getRandomNumber(1, elements.length); // получить случайную длину массива

  return elementsCopy;
};

// генерация адресов аватарок -
// var generateAvatarsUrl = function (count) {
//   var avatars = [];
//   for (var i = 0; i < count; i++) {
//     avatars.push(AVATAR_LINK + i + AVATAR_IMG_EXTENSION);
//   }
//   return avatars;
// };

// var userAvatars = generateAvatarsUrl(OFFER_AMOUNT);

var mapBlock = document.querySelector('.map');
var mapPins = mapBlock.querySelector('.map__pins');
mapBlock.classList.remove('map--faded');

// создание одного объявления со случайными параметрами
var createOffer = function () {
  var locationX = getRandomNumber(LOCATION_X_MIN + PIN_WIDTH / 2, locationXMax - PIN_WIDTH / 2);
  var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX - MENU_HEIGHT);

  return {
    author: {
      avatar: AVATAR_LINK + getRandomNumber(1, 8) + AVATAR_IMG_EXTENSION // getRandomElement(userAvatars)
    },
    offer: {
      title: getRandomElement(OFFER_TITLES),
      address: locationX + ', ' + locationY,
      price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
      type: getRandomElement(OFFER_TYPES),
      rooms: getRandomElement(OFFER_ROOMS),
      guests: getRandomElement(OFFER_GUESTS),
      checkin: getRandomElement(OFFER_CHECKINS),
      checkout: getRandomElement(OFFER_CHECKOUTS),
      features: getRandomLength(OFFER_FEATURES),
      description: '',
      photos: getRandomLength(OFFER_PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// генерация массива объявлений
var generateOffers = function () {
  var offers = [];
  for (var i = 0; i < OFFER_AMOUNT; i++) {
    offers.push(createOffer());
  }
  return offers;
};

// шаблон метки
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// отрисовка метки объявления
var renderOfferPin = function (offerPin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('img').src = offerPin.author.avatar;
  pinElement.querySelector('img').alt = offerPin.offer.title;
  pinElement.style.left = (offerPin.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (offerPin.location.y + PIN_HEIGHT) + 'px';

  return pinElement;
};

// добавление объявлений
var placeOffers = function (offers) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderOfferPin(offers[i]));
  }
  mapPins.appendChild(fragment);
};

mapBlock.appendChild(placeOffers(generateOffers()));
