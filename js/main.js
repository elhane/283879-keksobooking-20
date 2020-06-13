'use strict';

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
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

// var KEY_CODE_ENTER = 13;
// var KEY_CODE_ESCAPE = 27;

var roomTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

var RoomsMinPrices = {
  BUNGALO: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000
};

var KeyCodes = {
  ENTER: 13,
  ESCAPE: 27
};

var locationXMax = document.querySelector('.map__overlay').offsetWidth;
var mapBlock = document.querySelector('.map');
var mapPins = mapBlock.querySelector('.map__pins');
var mapPinMain = mapBlock.querySelector('.map__pin--main');
var mapAdForm = document.querySelector('.ad-form');
var mapAdFormFieldsets = mapAdForm.querySelectorAll('input, select, fieldset');
var mapFiltersForm = document.querySelector('.map__filters');
var mapFiltersFormFieldsets = mapFiltersForm.querySelectorAll('input, select, fieldset');
var mapAddressInput = mapAdForm.querySelector('#address');
var mapAdFormRoomsSelect = mapAdForm.querySelector('select[name="rooms"]');
var mapAdFormCapacitySelect = mapAdForm.querySelector('select[name="capacity"]');
var mapAdFormTitle = mapAdForm.querySelector('input[name="title"]');
var mapAdFormRoomType = mapAdForm.querySelector('select[name="type"]');
var mapAdFormPrice = mapAdForm.querySelector('input[name="price"]');
var mapAdFormTimeIn = mapAdForm.querySelector('select[name="timein"]');
var mapAdFormTimeOut = mapAdForm.querySelector('select[name="timeout"]');

var filterBlock = document.querySelector('.map__filters-container');

// полчучение шаблона карточки
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
// шаблон метки
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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

function disableElements(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', 'disabled');
  }
}

function enableElements(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled');
  }
}

function disableActiveMode() {
  mapBlock.classList.add('map--faded');
  mapAdForm.classList.add('ad-form--disabled');
  mapFiltersForm.setAttribute('disabled', 'disabled');
  disableElements(mapAdFormFieldsets);
  disableElements(mapFiltersFormFieldsets);
}

disableActiveMode();

// активировать страницу
function enableActiveMode() {
  mapBlock.classList.remove('map--faded');
  mapAdForm.classList.remove('ad-form--disabled');
  mapFiltersForm.removeAttribute('disabled');
  mapAddressInput.value = getPinPosition();
  mapAddressInput.setAttribute('readonly', 'readonly');
  mapAddressInput.classList.add('ad-form--disabled');
  mapAdFormTitle.addEventListener('input', titleInputHandler);
  mapAdFormRoomType.addEventListener('input', roomTypeInputHandler);
  mapAdFormRoomsSelect.addEventListener('input', roomsSelecInputHandler);
  mapAdFormCapacitySelect.addEventListener('input', roomsSelecInputHandler);
  mapAdFormTimeIn.addEventListener('input', timeInInputHandler);
  mapAdFormTimeOut.addEventListener('input', timeOutInputHandler);
  enableElements(mapAdFormFieldsets);
  enableElements(mapFiltersFormFieldsets);

  placeOffers(offers);
}

function getPinPosition() {
  var positionX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
  var positionY = Math.round(mapPinMain.offsetTop + (mapPinMain.offsetHeight) / 2);
  // 22 прибавить острие пина до деления? или вынести в константу
  return positionX + ', ' + positionY;
}

function roomsSelecInputHandler() {
  switch (true) {
    case (mapAdFormRoomsSelect.value === '100' && mapAdFormCapacitySelect.value !== '0'):
      mapAdFormRoomsSelect.setCustomValidity('Для выбранного количества комнат размещение гостей невозможно');
      break;

    case (mapAdFormRoomsSelect.value !== '100' && mapAdFormCapacitySelect.value === '0'):
      mapAdFormRoomsSelect.setCustomValidity('Выберите количество гостей');
      break;

    case (mapAdFormCapacitySelect.value > mapAdFormRoomsSelect.value && mapAdFormCapacitySelect.value !== '0'):
      // console.log(mapAdFormRoomsSelect.value, mapAdFormCapacitySelect.value);
      mapAdFormRoomsSelect.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
      break;

    default:
      mapAdFormRoomsSelect.setCustomValidity('');
  }
}

function titleInputHandler() {
  switch (true) {
    case (mapAdFormTitle.validity.tooShort):
      mapAdFormTitle.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
      break;
    case (mapAdFormTitle.validity.tooLong):
      mapAdFormTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
      break;

    case (mapAdFormTitle.validity.valueMissing):
      mapAdFormTitle.setCustomValidity('Обязательное поле');
      break;

    default:
      mapAdFormTitle.setCustomValidity('');
  }
}

function roomTypeInputHandler() {
  mapAdFormPrice.min = RoomsMinPrices[(mapAdFormRoomType.value).toUpperCase()];
  mapAdFormPrice.placeholder = RoomsMinPrices[(mapAdFormRoomType.value).toUpperCase()];
}

function timeInInputHandler() {
  mapAdFormTimeOut.value = mapAdFormTimeIn.value;
}

function timeOutInputHandler() {
  mapAdFormTimeIn.value = mapAdFormTimeOut.value;
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

// отрисовка метки объявления
function renderOfferPin(offerPin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('img').src = offerPin.author.avatar;
  pinElement.querySelector('img').alt = offerPin.offer.title;
  pinElement.style.left = (offerPin.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (offerPin.location.y - PIN_HEIGHT) + 'px';

  pinElement.addEventListener('click', function () {
    closeCard();
    pinElement.classList.add('map__pin--active');

    // if (pinElement.classList.contains('map__pin--active')) {
    //   pinElement.classList.remove('map__pin--active');
    // } else {
    //   pinElement.classList.add('map__pin--active');
    // }

    mapBlock.insertBefore(renderCard(offerPin), filterBlock);
    var cardCloseButton = document.querySelector('.popup__close');
    cardCloseButton.addEventListener('click', popupCloseMouseDownHandler);
    document.addEventListener('keydown', mapCardEscPressHandler);
  });
  return pinElement;
}

// добавление меток объявлений
function placeOffers(offers) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    if (offers[i].offer) {
      fragment.appendChild(renderOfferPin(offers[i]));
    }
  }
  mapPins.appendChild(fragment);
}

// генерация объявлений
var offers = generateOffers(OFFER_AMOUNT);

// функция только для скрытия
function hideElement(element) {
  element.classList.add('hidden');
}

// функция для изменения сдержимого и скрытия в случае отсутствия блока
function changeTextContent(container, offerItemBlock) {
  if (offerItemBlock) {
    container.textContent = offerItemBlock;
  } else {
    hideElement(container);
  }
}

function renderFeatures(container, features) {
  container.innerHTML = '';

  if (features.length) {
    for (var i = 0; i < features.length; i++) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature', 'popup__feature--' + features[i]);
      container.appendChild(featureItem);
    }
  } else {
    hideElement(container);
  }
}

function renderPhotos(container, photos) {
  container.innerHTML = '';

  if (photos.length) {
    for (var i = 0; i < photos.length; i++) {
      var photoItem = document.createElement('img');
      photoItem.classList.add('popup__photo');
      photoItem.src = photos[i];
      photoItem.width = PHOTO_WIDTH;
      photoItem.height = PHOTO_HEIGHT;
      photoItem.alt = PHOTO_ALT;
      container.appendChild(photoItem);
    }
  } else {
    hideElement(container);
  }
}

// подбор правильных окончаний
function switchRooms(rooms) {
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
}

// подбор правильных окончаний
function switchGuests(guests) {
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
}

// отрисовка карточки объявления
function renderCard(offerItem) {
  var cardElements = cardTemplate.cloneNode(true);
  var cardPhotos = cardElements.querySelector('.popup__photos');
  var cardFeatures = cardElements.querySelector('.popup__features');
  var cardAvatar = cardElements.querySelector('.popup__avatar');
  var cardPrice = cardElements.querySelector('.popup__text--price');
  var cardTime = cardElements.querySelector('.popup__text--time');
  var cardCapacity = cardElements.querySelector('.popup__text--capacity');

  cardAvatar.src = offerItem.author.avatar;

  changeTextContent(cardElements.querySelector('.popup__title'), offerItem.offer.title);
  changeTextContent(cardElements.querySelector('.popup__text--address'), offerItem.offer.address);
  changeTextContent(cardElements.querySelector('.popup__type'), roomTypes[offerItem.offer.type]);
  changeTextContent(cardElements.querySelector('.popup__description'), offerItem.offer.description);

  renderFeatures(cardFeatures, offerItem.offer.features);
  renderPhotos(cardPhotos, offerItem.offer.photos);

  if (offerItem.offer.price) {
    cardPrice.textContent = offerItem.offer.price + ' ₽/ночь';
  } else {
    hideElement(cardPrice);
  }

  if (offerItem.offer.checkin && offerItem.offer.checkout) {
    cardTime.textContent = 'заезд после ' + offerItem.offer.checkin + ', выезд до ' + offerItem.offer.checkout;
  } else {
    hideElement(cardTime);
  }

  if (offerItem.offer.rooms || offerItem.offer.guests) {
    cardCapacity.textContent = switchRooms(offerItem.offer.rooms) + switchGuests(offerItem.offer.guests);
  } else {
    hideElement(cardCapacity);
  }

  return cardElements;
}

function closeCard() {
  var mapCard = mapBlock.querySelector('.map__card');
  var pinActive = document.querySelector('.map__pin--active');

  if (mapCard) {
    mapCard.remove();
    pinActive.classList.remove('map__pin--active');
  }

  document.removeEventListener('keydown', mapCardEscPressHandler);
}

function mapPinMainMouseDownHandler(evt) {
  if (evt.which === 1) {
    enableActiveMode();
  }
}

function mapPinMainKeyDownHandler(evt) {
  if (evt.keyCode === KeyCodes.ENTER) {
    enableActiveMode();
  }
}

function popupCloseMouseDownHandler(evt) {
  if (evt.which === 1) {
    closeCard();
  }
}

function mapCardEscPressHandler(evt) {
  if (evt.keyCode === KeyCodes.ESCAPE) {
    evt.preventDefault();
    closeCard();
  }
}

mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
mapPinMain.addEventListener('keydown', mapPinMainKeyDownHandler);
