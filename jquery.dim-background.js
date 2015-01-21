/**
 *  Usage: $("<selector>").dimBackground([options] [, callback]);
 *
 *  @author Andy Wermke <andy@dev.next-step-software.com>
 *
 */
(function ($) {
  'use strict';

  var dimmedNodes = [];   /// [ {$curtain: ?, $nodes: jQueryArray} ]

  /**
   *  Dim the whole page except for the selected elements.
   *  @param options
   *    Optional. See `$.fn.dimBackground.defaults`.
   *  @param callback
   *    Optional. Called when dimming animation has completed.
   */
  $.fn.dimBackground = function (options, callback) {
    var params = parseParams(options, callback);
    options  = params.options;
    callback = params.callback;

    options = $.extend({}, $.fn.dimBackground.defaults, options);

    // Initialize curtain
    var $curtain = $('<div class="dimbackground-curtain"></div>');
    $curtain.css({
      position:   'fixed',
      left:     0,
      top:    0,
      width:    '100%',
      height:   '100%',
      background: 'black',
      opacity:  0,
      zIndex:   options.curtainZIndex
    });
    $('body').append($curtain);

    // Top elements z-indexing
    this.each(function (){
      var $this = $(this);
      var opts = $.meta ? $.extend( {}, options, $this.data() ) : options;

      this._$curtain = $curtain;
      this._originalPosition = $this.css('position').toLowerCase();
      if (this._originalPosition != "absolute" && this._originalPosition != "fixed") {
        $this.css('position', 'relative');
      }

      this._originalZIndex = $this.css('z-index');
      if (this._originalZIndex == "auto" || this._originalZIndex <= opts.curtainZIndex) {
        $this.css('z-index', opts.curtainZIndex+1);
      }
    });

    $curtain.stop().animate({opacity: options.darkness}, options.fadeInDuration, callback);
    dimmedNodes.push( {$curtain: $curtain, $nodes: this} );
    return this;
  };

  /**
   *  Undo the dimming.
   *  @param options
   *    Optional. See `$.fn.dimBackground.defaults`.
   *  @param callback
   *    Optional. Called when "undimming" animation has completed.
   */
  $.fn.undim = function (options, callback) {
    var params = parseParams(options, callback);
    options  = params.options;
    callback = params.callback;
    options = $.extend({}, $.fn.dimBackground.defaults, options);

    var $curtain;
    var nodeZIndexMap = [];   /// [ [node, originalPosition, originalZIndex], ... ]
    this.each(function () {
      var $this = $(this);
      var opts = $.meta ? $.extend( {}, options, $this.data() ) : options;

      if (this._$curtain) {
        if (!$curtain) {
          $curtain = this._$curtain;
        }
        if (typeof this._originalPosition != "undefined") {
          nodeZIndexMap.push( [this, this._originalPosition, this._originalZIndex] );
        }
        this._$curtain = undefined;
        this._originalPosition = undefined;
        this._originalZIndex = undefined;
      }
    });

    if ($curtain) {
      $curtain.animate({opacity: 0}, options.fadeOutDuration, function () {
        for (var i=0; i<nodeZIndexMap.length; i++) {
          var node = nodeZIndexMap[i][0],
            position = nodeZIndexMap[i][1],
            zIndex = nodeZIndexMap[i][2];
          $(node).css({
            position: position,
            zIndex: zIndex
          });
        }
        $curtain.remove();
        callback();
      });

      var match;
      for (var i=0; i<dimmedNodes.length; i++) {
        var entry = dimmedNodes[i];
        if (entry.$curtain == $curtain) {
          match = i;
          break;
        }
      }
      if (match) {
        dimmedNodes = dimmedNodes.slice(0, i).concat( dimmedNodes.slice(i+1) );
      }
    }
    return this;
  };

  /**
   *  Undim all dimmed elements.
   *  @param options
   *    Optional. See `$.fn.dimBackground.defaults`.
   *  @param callback
   *    Optional. Called when all animations have completed.
   */
  $.undim = function (options, callback) {
      var params = parseParams(options, callback);
      options = params.options;
      callback = params.callback;
      options = $.extend({}, $.fn.dimBackground.defaults, options);
   
    var _dimmedNodes = dimmedNodes.slice();

    var completed = 0, total = _dimmedNodes.length;
    for (var i=0; i<dimmedNodes.length; i++) {
      _dimmedNodes[i].$nodes.undim(options,done);
    }

    if (total === 0) {
      callback();
    }

    function done () {
      completed++;
      if (completed == total) {
        callback();
      }
    }
  };

  // Plugin default options
  $.fn.dimBackground.defaults = {
    darkness    : 0.75,   // 0 means no dimming, 1 means completely dark
    fadeInDuration  : 300,    // in ms
    fadeOutDuration : 300,    // in ms
    curtainZIndex   : 999
  };

  /// @return {options:object, callback:function}
  function parseParams (options, callback) {
    if (typeof options == "function") {
      callback = options;
      options = {};
    }
    if (typeof options != "object") {
      options = {};
    }
    if (typeof callback != "function") {
      callback = function () {};
    }

    return {
      options   : options,
      callback  : callback
    };
  }
}( jQuery ));
