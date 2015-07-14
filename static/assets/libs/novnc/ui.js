/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2015 Samuel Mannehed for Cendio AB
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

/* jslint white: false, browser: true */
/* global window, $D, Util, WebUtil, RFB, Display */

var UI;

(function() {
  "use strict";

  var resizeTimeout;

  // Load supporting scripts
  /*
  window.onscriptsload = function() {
    UI.load();
  };
  */
  Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js",
    "keysymdef.js", "keyboard.js", "input.js", "display.js",
    "jsunzip.js", "rfb.js", "keysym.js"
  ]);

  UI = {

    rfb_state: 'loaded',
    settingsOpen: false,
    connSettingsOpen: false,
    popupStatusTimeout: null,
    clipboardOpen: false,
    keyboardVisible: false,
    hideKeyboardTimeout: null,
    lastKeyboardinput: null,
    defaultKeyboardinputLen: 100,
    extraKeysVisible: false,
    ctrlOn: false,
    altOn: false,
    isTouchDevice: false,
    rememberedClipSetting: null,

    // Setup rfb object, load settings from browser storage, then call
    // UI.init to setup the UI/menus
    load: function(callback) {
      WebUtil.initSettings(UI.start, callback);
    },

    // Render default UI and initialize settings menu
    start: function(callback) {
      UI.isTouchDevice = 'ontouchstart' in document.documentElement;

      // Settings with immediate effects
      WebUtil.init_logging('warn');

      WebUtil.selectStylesheet(null);
      // call twice to get around webkit bug
      WebUtil.selectStylesheet('default');

      // if port == 80 (or 443) then it won't be present and should be
      // set manually
      var port = window.location.port;
      if (!port) {
        if (window.location.protocol.substring(0, 5) == 'https') {
          port = 443;
        } else if (window.location.protocol.substring(0, 4) == 'http') {
          port = 80;
        }
      }

      var autoconnect = WebUtil.getQueryVar('autoconnect', false);
      if (autoconnect === 'true' || autoconnect == '1') {
        autoconnect = true;
        UI.connect();
      } else {
        autoconnect = false;
      }

      UI.updateVisualState();

      // Show mouse selector buttons on touch screen devices
      if (UI.isTouchDevice) {
        // Show mobile buttons
        $D('noVNC_mobile_buttons').style.display = "inline";
        // Remove the address bar
        setTimeout(function() {
          window.scrollTo(0, 1);
        }, 100);
      }

      Util.addEvent(window, 'resize', function() {
        UI.onresize();
      });


      Util.addEvent(window, 'load', UI.keyboardinputReset);

      Util.addEvent(window, 'beforeunload', function() {
        if (UI.rfb && UI.rfb_state === 'normal') {
          return "You are currently connected.";
        }
      });

      // Add mouse event click/focus/blur event handlers to the UI
      UI.addMouseHandlers();

      if (typeof callback === "function") {
        callback(UI.rfb);
      }
    },

    initRFB: function() {
      try {
        UI.rfb = new RFB({
          'target': $D('noVNC_canvas'),
          'onUpdateState': UI.updateState,
          'onFBUComplete': UI.FBUComplete,
        });
        return true;
      } catch (exc) {
        UI.updateState(null, 'fatal', null, 'Unable to create RFB client -- ' + exc);
        return false;
      }
    },

    addMouseHandlers: function() {
      $D("sendCtrlAltDelButton").onclick = UI.sendCtrlAltDel;
    },

    onresize: function(callback) {
      if (!UI.rfb) return;

      var size = UI.getCanvasLimit();

      if (size && UI.rfb_state === 'normal' && UI.rfb.get_display()) {
        var display = UI.rfb.get_display();
      }
    },

    getCanvasLimit: function() {
      var container = $D('noVNC_container');

      if (container) {
        // Hide the scrollbars until the size is calculated
        container.style.overflow = "hidden";

        var pos = Util.getPosition(container);
        var w = pos.width;
        var h = pos.height;

        container.style.overflow = "visible";

        if (isNaN(w) || isNaN(h)) {
          return false;
        } else {
          return {
            w: w,
            h: h
          };
        }
      }
    },

    // Read form control compatible setting from cookie
    getSetting: function(name) {
      var ctrl = $D('noVNC_' + name);
      var val = WebUtil.readSetting(name);
      return val;
    },


    sendCtrlAltDel: function() {
      UI.rfb.sendCtrlAltDel();
    },

    updateState: function(rfb, state, oldstate, msg) {
      UI.rfb_state = state;
      var klass;
      switch (state) {
        case 'failed':
        case 'fatal':
          klass = "noVNC_status_error";
          break;
        case 'normal':
          klass = "noVNC_status_normal";
          break;
        case 'disconnected':
          //$D('noVNC_container').style.display = "none";
        case 'loaded':
          klass = "noVNC_status_normal";
          break;
        case 'password':
          $D('noVNC_connect_button').value = "Send Password";
          $D('noVNC_connect_button').onclick = UI.setPassword;
          $D('noVNC_password').focus();

          klass = "noVNC_status_warn";
          break;
        default:
          klass = "noVNC_status_warn";
          break;
      }

      UI.updateVisualState();
    },

    // Update cookie and form control setting. If value is not set, then
    // updates from control to current cookie setting.
    updateSetting: function(name, value) {
      // Save the cookie for this session
      if (typeof value !== 'undefined') {
        WebUtil.writeSetting(name, value);
      }
    },

    // Disable/enable controls depending on connection state
    updateVisualState: function() {
      var connected = UI.rfb && UI.rfb_state === 'normal';

      if (connected) {
        $D('sendCtrlAltDelButton').style.display = "inline";
      }

      switch (UI.rfb_state) {
        case 'fatal':
        case 'failed':
        case 'disconnected':
          UI.connSettingsOpen = false;
          break;
      }

      //Util.Debug("<< updateVisualState");
    },

    // This resize can not be done until we know from the first Frame Buffer Update
    // if it is supported or not.
    // The resize is needed to make sure the server desktop size is updated to the
    // corresponding size of the current local window when reconnecting to an
    // existing session.
    FBUComplete: function(rfb, fbu) {
      UI.onresize();
      UI.rfb.set_onFBUComplete(function() {});
    },

    connect: function() {
      var host = UI.getSetting('host');
      var port = UI.getSetting('port');
      var password = UI.getSetting('password');
      var path = UI.getSetting('path');
      if ((!host) || (!port)) {
        throw new Error("Must set host and port");
      }

      if (!UI.initRFB()) return;

      UI.rfb.set_encrypt(false);
      UI.rfb.set_true_color(true);
      UI.rfb.set_local_cursor(false);
      UI.rfb.set_shared(false);
      UI.rfb.set_view_only(false);
      UI.rfb.set_repeaterID('');

      UI.rfb.connect(host, port, null, path);

      //Close dialog.
      setTimeout(UI.setBarPosition, 100);
      $D('noVNC_container').style.display = "inline";
    },

    disconnect: function() {
      UI.rfb.disconnect();

      // Restore the callback used for initial resize
      UI.rfb.set_onFBUComplete(UI.FBUComplete);
    },

  };
})();
