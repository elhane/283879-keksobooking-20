'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var LEFT_MOUSE_BUTTON = 1;

  window.util = {
    isEnterPressed: function (evt) {
      return evt.keyCode === ENTER_KEYCODE;
    },
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    isLeftMouseDown: function (evt) {
      return evt.which === LEFT_MOUSE_BUTTON;
    },
  };
})();
