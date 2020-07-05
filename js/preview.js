'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HOUSING_PHOTO_WIDTH = 70;
  var HOUSING_PHOTO_HEIGHT = 70;

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreviewBlock = document.querySelector('.ad-form-header__preview img');
  var avatarPreviewDefaultScr = avatarPreviewBlock.src;
  var housingPhotoChooser = document.querySelector('#images');
  var housingPhotoPreviewBlock = document.querySelector('.ad-form__photo');

  function loadPhoto(fileChooser, filePreview, callback) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (callback) {
          filePreview = callback();
        }
        filePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function createImageElement() {
    var photoItem = document.createElement('img');
    photoItem.width = HOUSING_PHOTO_WIDTH;
    photoItem.height = HOUSING_PHOTO_HEIGHT;
    housingPhotoPreviewBlock.appendChild(photoItem);
    return photoItem;
  }

  function resetPhotosInputs() {
    avatarPreviewBlock.src = avatarPreviewDefaultScr;
    housingPhotoPreviewBlock.innerHTML = '';
  }

  function avatarUploadHandler() {
    loadPhoto(avatarChooser, avatarPreviewBlock);
  }

  function housingPhotoUploadHandler() {
    loadPhoto(housingPhotoChooser, housingPhotoChooser, createImageElement);
  }

  function addPhotosUploadListeners() {
    avatarChooser.addEventListener('change', avatarUploadHandler);
    housingPhotoChooser.addEventListener('change', housingPhotoUploadHandler);
  }

  window.preview = {
    resetPhotosInputs: resetPhotosInputs,
    addPhotosUploadListeners: addPhotosUploadListeners
  };
})();
