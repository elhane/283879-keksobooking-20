'use strict';

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var MENU_HEIGHT = 46;

var AVATAR_LINK = 'img/avatars/user0';
var AVATAR_IMG_EXTENSION = '.png';

var OFFER_AMOUNT = 8;

var OFFER_PRICE_MIN = 1;
var OFFER_PRICE_MAX = 1000000;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;
var PHOTO_ALT = 'Фотография жилья';

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
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// получение случайного элемента массива
var getRandomElement = function (elements) {
  var randomIndex = getRandomNumber(0, elements.length - 1);
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

// перевод типов жилья
var roomTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

var mapBlock = document.querySelector('.map');
var mapPins = mapBlock.querySelector('.map__pins');
mapBlock.classList.remove('map--faded');

// создание объявления со случайными параметрамим
var createOffer = function (count) {
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
      rooms: getRandomNumber(1, 3),
      guests: getRandomNumber(0, 2),
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
};

// генерация массива объявлений
var generateOffers = function () {
  var offers = [];
  for (var i = 0; i < OFFER_AMOUNT; i++) {
    offers.push(createOffer(i));
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
  pinElement.style.top = (offerPin.location.y - PIN_HEIGHT) + 'px';

  return pinElement;
};

// добавление меток объявлений
var placeOffers = function (offers) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    // проверяем есть ли offer
    if (offers[i].offer) {
      fragment.appendChild(renderOfferPin(offers[i]));
    }
  }
  mapPins.appendChild(fragment);
};

// генерация объявлений
var offers = generateOffers();

placeOffers(offers);

// полчучение шаблона карточки
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderFeatures = function (container, features) {
  container.innerHTML = '';

  for (var i = 0; i < features.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', 'popup__feature--' + features[i]);
    container.appendChild(featureItem);
  }
};

var renderPhotos = function (container, photos) {
  container.innerHTML = '';

  for (var i = 0; i < photos.length; i++) {
    var photoItem = document.createElement('img');
    photoItem.classList.add('popup__photo');
    photoItem.src = photos[i];
    photoItem.width = PHOTO_WIDTH;
    photoItem.height = PHOTO_HEIGHT;
    photoItem.alt = PHOTO_ALT;
    container.appendChild(photoItem);
  }
};

// подбор правильных окончаний
var switchRooms = function (rooms) {
  var str = '';

  switch (rooms) {
    case 1:
      str = '1 комната';
      break;

    case 100:
      str = ' 100 комнат';
      break;

    default:
      str = rooms + ' комнаты';
  }
  return str;
};

// подбор правильных окончаний
var switchGuests = function (guests) {
  var str = '';

  switch (guests) {
    case 0:
      // str = ' не для гостей';
      break;

    case 1:
      str = ' для 1 гостя';
      break;

    default:
      str = ' для ' + guests + ' гостей';
  }
  return str;
};

// отрисовка карточки объявления
var renderCard = function (offerItem) {
  var cardElements = cardTemplate.cloneNode(true);
  var cardPhotos = cardElements.querySelector('.popup__photos');
  var cardFeatures = cardElements.querySelector('.popup__features');

  if (offerItem.offer.title) {
    cardElements.querySelector('.popup__title').textContent = offerItem.offer.title;
  } else {
    cardElements.querySelector('.popup__title').classList.add('visually-hidden');
  }

  if (offerItem.offer.address) {
    cardElements.querySelector('.popup__text--address').textContent = offerItem.offer.address;
  } else {
    cardElements.querySelector('.popup__text--address').classList.add('visually-hidden');
  }

  if (offerItem.offer.price) {
    cardElements.querySelector('.popup__text--price').textContent = offerItem.offer.price + ' ₽/ночь';
  } else {
    cardElements.querySelector('.popup__text--price').classList.add('visually-hidden');
  }

  if (offerItem.offer.type) {
    cardElements.querySelector('.popup__type').textContent = roomTypes[offerItem.offer.type];
  } else {
    cardElements.querySelector('.popup__type').classList.add('visually-hidden');
  }

  // наверное нужно будет еще уточнить, вдруг будет указан только заезд или только выезд?))
  if (offerItem.offer.checkin && offerItem.offer.checkout) {
    cardElements.querySelector('.popup__text--time').textContent = 'заезд после ' + offerItem.offer.checkin + ', выезд до ' + offerItem.offer.checkout;
  } else {
    cardElements.querySelector('.popup__text--time').classList.add('visually-hidden');
  }

  if (offerItem.offer.description) {
    cardElements.querySelector('.popup__description').textContent = offerItem.offer.description;
  } else {
    cardElements.querySelector('.popup__description').classList.add('visually-hidden');
  }

  if (offerItem.offer.rooms || offerItem.offer.guests) {
    cardElements.querySelector('.popup__text--capacity').textContent = switchRooms(offerItem.offer.rooms) + switchGuests(offerItem.offer.guests);
  } else {
    cardElements.querySelector('.popup__text--capacity').classList.add('visually-hidden');
  }

  if (offerItem.offer.features.length) {
    renderFeatures(cardFeatures, offerItem.offer.features);
  } else {
    cardFeatures.classList.add('visually-hidden');
  }

  if (offerItem.offer.photos.length) {
    renderPhotos(cardPhotos, offerItem.offer.photos);
  } else {
    cardPhotos.classList.add('visually-hidden');
  }

  return cardElements;
};

// показ карточки первого объявления
var filterBlock = document.querySelector('.map__filters-container');
mapBlock.insertBefore(renderCard(offers[0]), filterBlock);
