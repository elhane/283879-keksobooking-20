'use strict';
(function () {
  var URL_GET = 'https://javascript.pages.academy/keksobooking/data';
  var URL_POST = 'https://javascript.pages.academy/keksobooking';
  var REQUEST_GET = 'GET';
  var REQUEST_POST = 'POST';

  var StatusCode = {
    OK: 200
  };

  var TIMEOUT_IN_MS = 10000;

  //
  function load(onSuccess, onError, type, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(type, url);
    xhr.send(data);
  }

  function loadData(onSuccess, onError) {
    load(onSuccess, onError, REQUEST_GET, URL_GET);
  }

  function uploadData(data, onSuccess, onError) {
    load(onSuccess, onError, REQUEST_POST, URL_POST, data);
  }

  window.backend = {
    loadData: loadData,
    uploadData: uploadData
  };
})();

