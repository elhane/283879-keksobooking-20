'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  var PHOTO_ALT = 'Фотография жилья';

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var roomTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
  };

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
    var cardCloseButton = cardElements.querySelector('.popup__close');
    cardCloseButton.addEventListener('click', window.map.popupCloseMouseDownHandler);

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

  window.card = {
    render: renderCard
  };
})();
