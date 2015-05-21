(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _pixel = require('./pixel');

var _pixel2 = _interopRequireDefault(_pixel);

var DrawSurface = (function () {
  function DrawSurface(container) {
    var params = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DrawSurface);

    this.container = container;
    if (!this.container) {
      throw new Exception('DrawSurface requires a container parameter.');
    }

    this.WIDTH = params.width || 512;
    this.HEIGHT = params.height || 512;
    this.TILE_SIZE = params.tileSize || 32;
    this.BG_TILE_SIZE = params.bgTileSize || 8;

    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.setAttribute('width', this.WIDTH);
    this.bgCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.bgCanvas);

    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.setAttribute('width', this.WIDTH);
    this.drawCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.drawCanvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.setAttribute('width', this.WIDTH);
    this.overlayCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.overlayCanvas);

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.drawCtx = this.drawCanvas.getContext('2d');
    this.overlayCtx = this.overlayCanvas.getContext('2d');

    this.drawBackground();
    this.initDrawSurface();

    this.container.addEventListener('mousemove', this.highlightPixel.bind(this), false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this), false);
  }

  _createClass(DrawSurface, [{
    key: 'drawBackground',
    value: function drawBackground() {
      var NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
      var NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

      for (var i = 0; i < NUM_TILES_HORIZ; i++) {
        for (var j = 0; j < NUM_TILES_VERT; j++) {
          var x = i * this.BG_TILE_SIZE;
          var y = j * this.BG_TILE_SIZE;

          var fill = (i + j) % 2 == 0 ? '#999' : '#777';

          this.bgCtx.fillStyle = fill;
          this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
        }
      }
    }
  }, {
    key: 'initDrawSurface',
    value: function initDrawSurface() {
      var NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
      var NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
      this.grid = [];

      for (var x = 0; x < NUM_PIXELS_HORIZ; x++) {
        this.grid[x] = [];

        for (var y = 0; y < NUM_PIXELS_VERT; y++) {
          this.grid[x].push(new _pixel2['default'](x, y));
        }
      }
    }
  }, {
    key: 'getPixelCoordinates',
    value: function getPixelCoordinates(ev) {
      var elRect = ev.target.getBoundingClientRect();
      var absX = ev.clientX;
      var absY = ev.clientY;
      var x = absX - elRect.left;
      var y = absY - elRect.top;

      var pixelX = Math.floor(x / this.TILE_SIZE);
      var pixelY = Math.floor(y / this.TILE_SIZE);

      return [pixelX, pixelY];
    }
  }, {
    key: 'highlightPixel',
    value: function highlightPixel(ev) {
      var _getPixelCoordinates = this.getPixelCoordinates(ev);

      var _getPixelCoordinates2 = _slicedToArray(_getPixelCoordinates, 2);

      var x = _getPixelCoordinates2[0];
      var y = _getPixelCoordinates2[1];

      var NUM_PIXELS = this.grid.length;

      // highlight the pixel under the mouse
      var currentPixel = this.grid[x][y];
      if (!currentPixel.highlighted) {
        var fillX = currentPixel.x * this.TILE_SIZE;
        var fillY = currentPixel.y * this.TILE_SIZE;

        this.overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
        currentPixel.highlighted = true;
      }

      // clear highlighting on other pixels
      var NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
      var NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
      for (var ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
        for (var iy = 0; iy < NUM_PIXELS_VERT; iy++) {
          var pixel = this.grid[ix][iy];
          if (pixel === currentPixel) {
            continue;
          }

          if (pixel.highlighted) {
            var clrX = pixel.x * this.TILE_SIZE;
            var clrY = pixel.y * this.TILE_SIZE;

            this.overlayCtx.clearRect(clrX, clrY, this.TILE_SIZE, this.TILE_SIZE);
            pixel.highlighted = false;
          }
        }
      }
    }
  }, {
    key: 'paintPixel',
    value: function paintPixel(ev) {
      var _getPixelCoordinates3 = this.getPixelCoordinates(ev);

      var _getPixelCoordinates32 = _slicedToArray(_getPixelCoordinates3, 2);

      var x = _getPixelCoordinates32[0];
      var y = _getPixelCoordinates32[1];

      var color = '#000000';
      var pixel = this.grid[x][y];

      var fillX = x * this.TILE_SIZE;
      var fillY = y * this.TILE_SIZE;
      this.drawCtx.fillStyle = color;
      this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
      pixel.color = color;
    }
  }]);

  return DrawSurface;
})();

exports['default'] = DrawSurface;
module.exports = exports['default'];

},{"./pixel":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pixel = function Pixel(x, y) {
  _classCallCheck(this, Pixel);

  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

;

exports["default"] = Pixel;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _draw_surface = require('./draw_surface');

var _draw_surface2 = _interopRequireDefault(_draw_surface);

document.addEventListener('DOMContentLoaded', function () {
  var drawContainer = document.getElementById('draw');
  var drawSurface = new _draw_surface2['default'](drawContainer);

  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));
});

},{"./draw_surface":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3BpeGVsLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O3FCQ0FrQixTQUFTOzs7O0lBRXJCLFdBQVc7QUFDSCxXQURSLFdBQVcsQ0FDRixTQUFTLEVBQWE7UUFBWCxNQUFNLGdDQUFDLEVBQUU7OzBCQUQ3QixXQUFXOztBQUViLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLFlBQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztLQUNwRTs7QUFFRCxRQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDbkMsUUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN2QyxRQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDOztBQUUzQyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELFFBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFMUMsUUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEQsUUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxRQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0RCxRQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JELFFBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUUvQyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEQsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzNDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN2QyxLQUFLLENBQUMsQ0FBQztHQUN4Qzs7ZUF0Q0csV0FBVzs7V0F3Q0EsMEJBQUc7QUFDaEIsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ3ZELFVBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzs7QUFFdkQsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQzlCLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUU5QixjQUFJLElBQUksR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsSUFBSSxDQUFDLEdBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFaEQsY0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzVCLGNBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakU7T0FDRjtLQUNGOzs7V0FFZSwyQkFBRztBQUNqQixVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyRCxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckQsVUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWYsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVsQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLGNBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO09BQ0Y7S0FDRjs7O1dBRW1CLDZCQUFDLEVBQUUsRUFBRTtBQUN2QixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDL0MsVUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUN0QixVQUFJLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUUxQixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU1QyxhQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3pCOzs7V0FFYyx3QkFBQyxFQUFFLEVBQUU7aUNBQ0wsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQzs7OztVQUFwQyxDQUFDO1VBQUUsQ0FBQzs7QUFDVCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBR3BDLFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7QUFDN0IsWUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzVDLFlBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7QUFFNUMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsMEJBQTBCLENBQUM7QUFDdkQsWUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2RSxvQkFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7T0FDakM7OztBQUdELFVBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ25ELFVBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNuRCxXQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDNUMsYUFBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUMzQyxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLGNBQUksS0FBSyxLQUFLLFlBQVksRUFBRTtBQUMxQixxQkFBUztXQUNWOztBQUVELGNBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUNyQixnQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3BDLGdCQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7O0FBRXBDLGdCQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RFLGlCQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztXQUMzQjtTQUNGO09BQ0Y7S0FDRjs7O1dBRVUsb0JBQUMsRUFBRSxFQUFFO2tDQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7Ozs7VUFBcEMsQ0FBQztVQUFFLENBQUM7O0FBQ1QsVUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTVCLFVBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLFVBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLFdBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3JCOzs7U0FsSUcsV0FBVzs7O3FCQXFJRixXQUFXOzs7Ozs7Ozs7Ozs7SUN2SXBCLEtBQUssR0FDRyxTQURSLEtBQUssQ0FDSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dCQURmLEtBQUs7O0FBRVAsTUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxNQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLE1BQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0NBQ25COztBQUNGLENBQUM7O3FCQUVhLEtBQUs7Ozs7Ozs7OzRCQ1RJLGdCQUFnQjs7OztBQUV4QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN4RCxNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELE1BQUksV0FBVyxHQUFHLDhCQUFnQixhQUFhLENBQUMsQ0FBQzs7QUFFakQsTUFBSSxjQUFjLEdBQUcsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0NBQzNFLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGl4ZWwgZnJvbSAnLi9waXhlbCc7XG5cbmNsYXNzIERyYXdTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IgKGNvbnRhaW5lciwgcGFyYW1zPXt9KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkRyYXdTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIik7XG4gICAgfVxuXG4gICAgdGhpcy5XSURUSCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gICAgdGhpcy5IRUlHSFQgPSBwYXJhbXMuaGVpZ2h0IHx8IDUxMjtcbiAgICB0aGlzLlRJTEVfU0laRSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAzMjtcbiAgICB0aGlzLkJHX1RJTEVfU0laRSA9IHBhcmFtcy5iZ1RpbGVTaXplIHx8IDg7XG5cbiAgICB0aGlzLmJnQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gICAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJnQ2FudmFzKTtcblxuICAgIHRoaXMuZHJhd0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gICAgdGhpcy5kcmF3Q2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5IRUlHSFQpO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZHJhd0NhbnZhcyk7XG5cbiAgICB0aGlzLm92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLm92ZXJsYXlDYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXlDYW52YXMpO1xuXG4gICAgdGhpcy5iZ0N0eCA9IHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmRyYXdDdHggPSB0aGlzLmRyYXdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLm92ZXJsYXlDdHggPSB0aGlzLm92ZXJsYXlDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuZHJhd0JhY2tncm91bmQoKTtcbiAgICB0aGlzLmluaXREcmF3U3VyZmFjZSgpO1xuXG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oaWdobGlnaHRQaXhlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMucGFpbnRQaXhlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICB9XG5cbiAgZHJhd0JhY2tncm91bmQgKCkge1xuICAgIGNvbnN0IE5VTV9USUxFU19IT1JJWiA9IHRoaXMuV0lEVEggLyB0aGlzLkJHX1RJTEVfU0laRTtcbiAgICBjb25zdCBOVU1fVElMRVNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5CR19USUxFX1NJWkU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9USUxFU19IT1JJWjsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IE5VTV9USUxFU19WRVJUOyBqKyspIHtcbiAgICAgICAgbGV0IHggPSBpICogdGhpcy5CR19USUxFX1NJWkU7XG4gICAgICAgIGxldCB5ID0gaiAqIHRoaXMuQkdfVElMRV9TSVpFO1xuXG4gICAgICAgIGxldCBmaWxsID0gKChpICsgaikgJSAyID09IDApID8gXCIjOTk5XCIgOiBcIiM3NzdcIjtcblxuICAgICAgICB0aGlzLmJnQ3R4LmZpbGxTdHlsZSA9IGZpbGw7XG4gICAgICAgIHRoaXMuYmdDdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5CR19USUxFX1NJWkUsIHRoaXMuQkdfVElMRV9TSVpFKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0RHJhd1N1cmZhY2UgKCkge1xuICAgIGNvbnN0IE5VTV9QSVhFTFNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgY29uc3QgTlVNX1BJWEVMU19WRVJUID0gdGhpcy5IRUlHSFQgLyB0aGlzLlRJTEVfU0laRTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgTlVNX1BJWEVMU19IT1JJWjsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBbXTtcblxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBOVU1fUElYRUxTX1ZFUlQ7IHkrKykge1xuICAgICAgICB0aGlzLmdyaWRbeF0ucHVzaChuZXcgUGl4ZWwoeCwgeSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFBpeGVsQ29vcmRpbmF0ZXMgKGV2KSB7XG4gICAgbGV0IGVsUmVjdCA9IGV2LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgYWJzWCA9IGV2LmNsaWVudFg7XG4gICAgbGV0IGFic1kgPSBldi5jbGllbnRZO1xuICAgIGxldCB4ID0gYWJzWCAtIGVsUmVjdC5sZWZ0O1xuICAgIGxldCB5ID0gYWJzWSAtIGVsUmVjdC50b3A7XG5cbiAgICBsZXQgcGl4ZWxYID0gTWF0aC5mbG9vcih4IC8gdGhpcy5USUxFX1NJWkUpO1xuICAgIGxldCBwaXhlbFkgPSBNYXRoLmZsb29yKHkgLyB0aGlzLlRJTEVfU0laRSk7XG5cbiAgICByZXR1cm4gW3BpeGVsWCwgcGl4ZWxZXTtcbiAgfVxuXG4gIGhpZ2hsaWdodFBpeGVsIChldikge1xuICAgIGxldCBbeCwgeV0gPSB0aGlzLmdldFBpeGVsQ29vcmRpbmF0ZXMoZXYpO1xuICAgIGNvbnN0IE5VTV9QSVhFTFMgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXG4gICAgLy8gaGlnaGxpZ2h0IHRoZSBwaXhlbCB1bmRlciB0aGUgbW91c2VcbiAgICBsZXQgY3VycmVudFBpeGVsID0gdGhpcy5ncmlkW3hdW3ldO1xuICAgIGlmICghY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgICBsZXQgZmlsbFggPSBjdXJyZW50UGl4ZWwueCAqIHRoaXMuVElMRV9TSVpFO1xuICAgICAgbGV0IGZpbGxZID0gY3VycmVudFBpeGVsLnkgKiB0aGlzLlRJTEVfU0laRTtcblxuICAgICAgdGhpcy5vdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCI7XG4gICAgICB0aGlzLm92ZXJsYXlDdHguZmlsbFJlY3QoZmlsbFgsIGZpbGxZLCB0aGlzLlRJTEVfU0laRSwgdGhpcy5USUxFX1NJWkUpO1xuICAgICAgY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjbGVhciBoaWdobGlnaHRpbmcgb24gb3RoZXIgcGl4ZWxzXG4gICAgbGV0IE5VTV9QSVhFTFNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgbGV0IE5VTV9QSVhFTFNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgZm9yIChsZXQgaXggPSAwOyBpeCA8IE5VTV9QSVhFTFNfSE9SSVo7IGl4KyspIHtcbiAgICAgIGZvciAobGV0IGl5ID0gMDsgaXkgPCBOVU1fUElYRUxTX1ZFUlQ7IGl5KyspIHtcbiAgICAgICAgbGV0IHBpeGVsID0gdGhpcy5ncmlkW2l4XVtpeV07XG4gICAgICAgIGlmIChwaXhlbCA9PT0gY3VycmVudFBpeGVsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGl4ZWwuaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgICBsZXQgY2xyWCA9IHBpeGVsLnggKiB0aGlzLlRJTEVfU0laRTtcbiAgICAgICAgICBsZXQgY2xyWSA9IHBpeGVsLnkgKiB0aGlzLlRJTEVfU0laRTtcblxuICAgICAgICAgIHRoaXMub3ZlcmxheUN0eC5jbGVhclJlY3QoY2xyWCwgY2xyWSwgdGhpcy5USUxFX1NJWkUsIHRoaXMuVElMRV9TSVpFKTtcbiAgICAgICAgICBwaXhlbC5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGFpbnRQaXhlbCAoZXYpIHtcbiAgICBsZXQgW3gsIHldID0gdGhpcy5nZXRQaXhlbENvb3JkaW5hdGVzKGV2KTtcbiAgICBsZXQgY29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgICBsZXQgcGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG5cbiAgICBsZXQgZmlsbFggPSB4ICogdGhpcy5USUxFX1NJWkU7XG4gICAgbGV0IGZpbGxZID0geSAqIHRoaXMuVElMRV9TSVpFO1xuICAgIHRoaXMuZHJhd0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB0aGlzLmRyYXdDdHguZmlsbFJlY3QoZmlsbFgsIGZpbGxZLCB0aGlzLlRJTEVfU0laRSwgdGhpcy5USUxFX1NJWkUpO1xuICAgIHBpeGVsLmNvbG9yID0gY29sb3I7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhd1N1cmZhY2U7XG4iLCJjbGFzcyBQaXhlbCB7XG4gIGNvbnN0cnVjdG9yICh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbG9yID0gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGl4ZWw7XG4iLCJpbXBvcnQgRHJhd1N1cmZhY2UgZnJvbSAnLi9kcmF3X3N1cmZhY2UnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBsZXQgZHJhd0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmF3Jyk7XG4gIGxldCBkcmF3U3VyZmFjZSA9IG5ldyBEcmF3U3VyZmFjZShkcmF3Q29udGFpbmVyKTtcblxuICBsZXQgdG14RmlsZUhhbmRsZXIgPSBuZXcgRmlsZUhhbmRsZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RteC1maWxlJykpO1xufSk7XG4iXX0=
