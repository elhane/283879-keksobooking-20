'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreviewBlock = document.querySelector('.ad-form-header__preview img');
  var avatarPreviewDefaultScr = avatarPreviewBlock.src;
  var housingPhotoChooser = document.querySelector('#images');
  var housingPhotoPreviewBlock = document.querySelector('.ad-form__photo');

  function loader(fileChooser, filePreview, callback) {
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
    photoItem.width = 70;
    photoItem.height = 70;
    housingPhotoPreviewBlock.appendChild(photoItem);
    return photoItem;
  }

  function resetPhotosInputs() {
    avatarPreviewBlock.src = avatarPreviewDefaultScr;
    housingPhotoPreviewBlock.innerHTML = '';
  }

  function avatarUploadHandler() {
    loader(avatarChooser, avatarPreviewBlock);
  }

  function housingPhotoUploadHandler() {
    loader(housingPhotoChooser, housingPhotoChooser, createImageElement);
  }

  window.photo = {
    avatarUploadHandler: avatarUploadHandler,
    housingPhotoUploadHandler: housingPhotoUploadHandler,
    avatarChooser: avatarChooser,
    housingPhotoChooser: housingPhotoChooser,
    resetPhotosInputs: resetPhotosInputs
  };
})();
