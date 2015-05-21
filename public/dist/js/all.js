(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _pixel = require('./pixel');

var _pixel2 = _interopRequireDefault(_pixel);

var _tile_surface = require('./tile_surface');

var _tile_surface2 = _interopRequireDefault(_tile_surface);

var DrawSurface = (function (_TileSurface) {
  function DrawSurface(container) {
    var params = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DrawSurface);

    _get(Object.getPrototypeOf(DrawSurface.prototype), 'constructor', this).call(this, container, params);

    this.BG_TILE_SIZE = params.bgTileSize || 8;
    this.initBackground();

    this.container.addEventListener('mousemove', this.highlightPixel.bind(this), false);
    this.container.addEventListener('mouseout', this.clearHighlight.bind(this), false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this), false);
  }

  _inherits(DrawSurface, _TileSurface);

  _createClass(DrawSurface, [{
    key: 'initCanvas',
    value: function initCanvas() {
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
    }
  }, {
    key: 'initBackground',
    value: function initBackground() {
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
    key: 'initTiles',
    value: function initTiles() {
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
    key: 'highlightPixel',
    value: function highlightPixel(ev) {
      var _getTileCoordinates = this.getTileCoordinates(ev);

      var x = _getTileCoordinates.x;
      var y = _getTileCoordinates.y;

      var NUM_PIXELS = this.grid.length;

      var currentPixel = this.grid[x][y];
      if (!currentPixel.highlighted) {
        var fillX = currentPixel.x * this.TILE_SIZE;
        var fillY = currentPixel.y * this.TILE_SIZE;

        this.overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
        currentPixel.highlighted = true;
      }

      this.clearHighlight(null, currentPixel);
    }
  }, {
    key: 'clearHighlight',
    value: function clearHighlight(ev, currentPixel) {
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
      var _getTileCoordinates2 = this.getTileCoordinates(ev);

      var x = _getTileCoordinates2.x;
      var y = _getTileCoordinates2.y;

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
})(_tile_surface2['default']);

exports['default'] = DrawSurface;
module.exports = exports['default'];

},{"./pixel":3,"./tile_surface":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileHandler = function FileHandler(element) {
  _classCallCheck(this, FileHandler);

  this.element = element;
};

exports["default"] = FileHandler;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _pixel = require("./pixel");

var _pixel2 = _interopRequireDefault(_pixel);

var TileSurface = (function () {
  function TileSurface(container) {
    var params = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, TileSurface);

    this.container = container;
    if (!this.container) {
      throw {
        name: "TileSurfaceException",
        message: "TileSurface requires a container parameter.",
        toString: function toString() {
          return "" + this.name + ": " + this.message;
        }
      };
    }

    this.WIDTH = params.width || 512;
    this.HEIGHT = params.height || 512;
    this.TILE_SIZE = params.tileSize || 32;

    this.initCanvas();
    this.initBackground();
    this.initTiles();
  }

  _createClass(TileSurface, [{
    key: "initCanvas",
    value: function initCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("width", this.WIDTH);
      this.canvas.setAttribute("height", this.HEIGHT);

      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
    }
  }, {
    key: "initBackground",
    value: function initBackground() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    }
  }, {
    key: "initTiles",
    value: function initTiles() {
      var NUM_TILES_HORIZ = this.WIDTH / this.TILE_SIZE;
      var NUM_TILES_VERT = this.HEIGHT / this.TILE_SIZE;
      this.grid = [];

      for (var x = 0; x < NUM_TILES_HORIZ; x++) {
        this.grid[x] = [];

        for (var y = 0; y < NUM_TILES_VERT; y++) {
          this.grid[x].push(new _pixel2["default"](x, y));
        }
      }
    }
  }, {
    key: "getTileCoordinates",
    value: function getTileCoordinates(ev) {
      var elRect = ev.target.getBoundingClientRect();
      var absX = ev.clientX;
      var absY = ev.clientY;
      var x = absX - elRect.left;
      var y = absY - elRect.top;

      var tileX = Math.floor(x / this.TILE_SIZE);
      var tileY = Math.floor(y / this.TILE_SIZE);

      return { x: tileX, y: tileY };
    }
  }]);

  return TileSurface;
})();

exports["default"] = TileSurface;
module.exports = exports["default"];

},{"./pixel":3}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _draw_surface = require('./draw_surface');

var _draw_surface2 = _interopRequireDefault(_draw_surface);

var _file_handler = require('./file_handler');

var _file_handler2 = _interopRequireDefault(_file_handler);

document.addEventListener('DOMContentLoaded', function () {
  var drawContainer = document.getElementById('tile-map');
  var drawSurface = new _draw_surface2['default'](drawContainer);

  var tmxFileHandler = new _file_handler2['default'](document.getElementById('tmx-file'));
});

},{"./draw_surface":1,"./file_handler":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL2ZpbGVfaGFuZGxlci5qcyIsIi9ob21lL2F1c3Rpbi9wcm9qZWN0cy9hZHZlbnR1cmUta2l0L3B1YmxpYy9qcy9waXhlbC5qcyIsIi9ob21lL2F1c3Rpbi9wcm9qZWN0cy9hZHZlbnR1cmUta2l0L3B1YmxpYy9qcy90aWxlX3N1cmZhY2UuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztxQkNBa0IsU0FBUzs7Ozs0QkFDSCxnQkFBZ0I7Ozs7SUFFbEMsV0FBVztBQUNILFdBRFIsV0FBVyxDQUNGLFNBQVMsRUFBYTtRQUFYLE1BQU0sZ0NBQUMsRUFBRTs7MEJBRDdCLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFUCxTQUFTLEVBQUUsTUFBTSxFQUFFOztBQUV6QixRQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzNDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUMxQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxR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QyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUUxQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUUzQyxhQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7S0FDL0I7OztTQTNERyxXQUFXOzs7cUJBOERGLFdBQVc7Ozs7Ozs7OzRCQ2hFRixnQkFBZ0I7Ozs7NEJBQ2hCLGdCQUFnQjs7OztBQUV4QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN4RCxNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELE1BQUksV0FBVyxHQUFHLDhCQUFnQixhQUFhLENBQUMsQ0FBQzs7QUFFakQsTUFBSSxjQUFjLEdBQUcsOEJBQWdCLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztDQUMzRSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBpeGVsIGZyb20gJy4vcGl4ZWwnO1xuaW1wb3J0IFRpbGVTdXJmYWNlIGZyb20gJy4vdGlsZV9zdXJmYWNlJztcblxuY2xhc3MgRHJhd1N1cmZhY2UgZXh0ZW5kcyBUaWxlU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yIChjb250YWluZXIsIHBhcmFtcz17fSkge1xuICAgIHN1cGVyKGNvbnRhaW5lciwgcGFyYW1zKTtcblxuICAgIHRoaXMuQkdfVElMRV9TSVpFID0gcGFyYW1zLmJnVGlsZVNpemUgfHwgODtcbiAgICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhpZ2hsaWdodFBpeGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmNsZWFySGlnaGxpZ2h0LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5wYWludFBpeGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gIH1cblxuICBpbml0Q2FudmFzICgpIHtcbiAgICB0aGlzLmJnQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gICAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJnQ2FudmFzKTtcblxuICAgIHRoaXMuZHJhd0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gICAgdGhpcy5kcmF3Q2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5IRUlHSFQpO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZHJhd0NhbnZhcyk7XG5cbiAgICB0aGlzLm92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLm92ZXJsYXlDYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXlDYW52YXMpO1xuXG4gICAgdGhpcy5iZ0N0eCA9IHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmRyYXdDdHggPSB0aGlzLmRyYXdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLm92ZXJsYXlDdHggPSB0aGlzLm92ZXJsYXlDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgfVxuXG4gIGluaXRCYWNrZ3JvdW5kICgpIHtcbiAgICBjb25zdCBOVU1fVElMRVNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5CR19USUxFX1NJWkU7XG4gICAgY29uc3QgTlVNX1RJTEVTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuQkdfVElMRV9TSVpFO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1fVElMRVNfSE9SSVo7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBOVU1fVElMRVNfVkVSVDsgaisrKSB7XG4gICAgICAgIGxldCB4ID0gaSAqIHRoaXMuQkdfVElMRV9TSVpFO1xuICAgICAgICBsZXQgeSA9IGogKiB0aGlzLkJHX1RJTEVfU0laRTtcblxuICAgICAgICBsZXQgZmlsbCA9ICgoaSArIGopICUgMiA9PSAwKSA/IFwiIzk5OVwiIDogXCIjNzc3XCI7XG5cbiAgICAgICAgdGhpcy5iZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgICB0aGlzLmJnQ3R4LmZpbGxSZWN0KHgsIHksIHRoaXMuQkdfVElMRV9TSVpFLCB0aGlzLkJHX1RJTEVfU0laRSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdFRpbGVzICgpIHtcbiAgICBjb25zdCBOVU1fUElYRUxTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuVElMRV9TSVpFO1xuICAgIGNvbnN0IE5VTV9QSVhFTFNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgdGhpcy5ncmlkID0gW107XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IE5VTV9QSVhFTFNfSE9SSVo7IHgrKykge1xuICAgICAgdGhpcy5ncmlkW3hdID0gW107XG5cbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgTlVNX1BJWEVMU19WRVJUOyB5KyspIHtcbiAgICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIGhpZ2hsaWdodFBpeGVsIChldikge1xuICAgIGxldCB7IHgsIHkgfSA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgICBjb25zdCBOVU1fUElYRUxTID0gdGhpcy5ncmlkLmxlbmd0aDtcblxuICAgIGxldCBjdXJyZW50UGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG4gICAgaWYgKCFjdXJyZW50UGl4ZWwuaGlnaGxpZ2h0ZWQpIHtcbiAgICAgIGxldCBmaWxsWCA9IGN1cnJlbnRQaXhlbC54ICogdGhpcy5USUxFX1NJWkU7XG4gICAgICBsZXQgZmlsbFkgPSBjdXJyZW50UGl4ZWwueSAqIHRoaXMuVElMRV9TSVpFO1xuXG4gICAgICB0aGlzLm92ZXJsYXlDdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIjtcbiAgICAgIHRoaXMub3ZlcmxheUN0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIHRoaXMuVElMRV9TSVpFLCB0aGlzLlRJTEVfU0laRSk7XG4gICAgICBjdXJyZW50UGl4ZWwuaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJIaWdobGlnaHQobnVsbCwgY3VycmVudFBpeGVsKTtcbiAgfVxuXG4gIGNsZWFySGlnaGxpZ2h0KGV2LCBjdXJyZW50UGl4ZWwpIHtcbiAgICBsZXQgTlVNX1BJWEVMU19IT1JJWiA9IHRoaXMuV0lEVEggLyB0aGlzLlRJTEVfU0laRTtcbiAgICBsZXQgTlVNX1BJWEVMU19WRVJUID0gdGhpcy5IRUlHSFQgLyB0aGlzLlRJTEVfU0laRTtcbiAgICBmb3IgKGxldCBpeCA9IDA7IGl4IDwgTlVNX1BJWEVMU19IT1JJWjsgaXgrKykge1xuICAgICAgZm9yIChsZXQgaXkgPSAwOyBpeSA8IE5VTV9QSVhFTFNfVkVSVDsgaXkrKykge1xuICAgICAgICBsZXQgcGl4ZWwgPSB0aGlzLmdyaWRbaXhdW2l5XTtcbiAgICAgICAgaWYgKHBpeGVsID09PSBjdXJyZW50UGl4ZWwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgICAgIGxldCBjbHJYID0gcGl4ZWwueCAqIHRoaXMuVElMRV9TSVpFO1xuICAgICAgICAgIGxldCBjbHJZID0gcGl4ZWwueSAqIHRoaXMuVElMRV9TSVpFO1xuXG4gICAgICAgICAgdGhpcy5vdmVybGF5Q3R4LmNsZWFyUmVjdChjbHJYLCBjbHJZLCB0aGlzLlRJTEVfU0laRSwgdGhpcy5USUxFX1NJWkUpO1xuICAgICAgICAgIHBpeGVsLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwYWludFBpeGVsIChldikge1xuICAgIGxldCB7IHgsIHkgfSA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgICBsZXQgY29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgICBsZXQgcGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG5cbiAgICBsZXQgZmlsbFggPSB4ICogdGhpcy5USUxFX1NJWkU7XG4gICAgbGV0IGZpbGxZID0geSAqIHRoaXMuVElMRV9TSVpFO1xuICAgIHRoaXMuZHJhd0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB0aGlzLmRyYXdDdHguZmlsbFJlY3QoZmlsbFgsIGZpbGxZLCB0aGlzLlRJTEVfU0laRSwgdGhpcy5USUxFX1NJWkUpO1xuICAgIHBpeGVsLmNvbG9yID0gY29sb3I7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhd1N1cmZhY2U7XG4iLCJjbGFzcyBGaWxlSGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlSGFuZGxlcjtcbiIsImNsYXNzIFBpeGVsIHtcbiAgY29uc3RydWN0b3IgKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY29sb3IgPSBudWxsO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQaXhlbDtcbiIsImltcG9ydCBQaXhlbCBmcm9tICcuL3BpeGVsJztcblxuY2xhc3MgVGlsZVN1cmZhY2Uge1xuICBjb25zdHJ1Y3RvciAoY29udGFpbmVyLCBwYXJhbXM9e30pIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyB7XG4gICAgICAgIG5hbWU6IFwiVGlsZVN1cmZhY2VFeGNlcHRpb25cIixcbiAgICAgICAgbWVzc2FnZTogXCJUaWxlU3VyZmFjZSByZXF1aXJlcyBhIGNvbnRhaW5lciBwYXJhbWV0ZXIuXCIsXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiBgJHt0aGlzLm5hbWV9OiAke3RoaXMubWVzc2FnZX1gOyB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuV0lEVEggPSBwYXJhbXMud2lkdGggfHwgNTEyO1xuICAgIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gICAgdGhpcy5USUxFX1NJWkUgPSBwYXJhbXMudGlsZVNpemUgfHwgMzI7XG5cbiAgICB0aGlzLmluaXRDYW52YXMoKTtcbiAgICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG4gICAgdGhpcy5pbml0VGlsZXMoKTtcbiAgfVxuXG4gIGluaXRDYW52YXMgKCkge1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5IRUlHSFQpO1xuXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgfVxuXG4gIGluaXRCYWNrZ3JvdW5kICgpIHtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLldJRFRILCB0aGlzLkhFSUdIVCk7XG4gIH1cblxuICBpbml0VGlsZXMgKCkge1xuICAgIGNvbnN0IE5VTV9USUxFU19IT1JJWiA9IHRoaXMuV0lEVEggLyB0aGlzLlRJTEVfU0laRTtcbiAgICBjb25zdCBOVU1fVElMRVNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgdGhpcy5ncmlkID0gW107XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IE5VTV9USUxFU19IT1JJWjsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBbXTtcblxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBOVU1fVElMRVNfVkVSVDsgeSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0VGlsZUNvb3JkaW5hdGVzIChldikge1xuICAgIGxldCBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IGFic1ggPSBldi5jbGllbnRYO1xuICAgIGxldCBhYnNZID0gZXYuY2xpZW50WTtcbiAgICBsZXQgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgICBsZXQgeSA9IGFic1kgLSBlbFJlY3QudG9wO1xuXG4gICAgbGV0IHRpbGVYID0gTWF0aC5mbG9vcih4IC8gdGhpcy5USUxFX1NJWkUpO1xuICAgIGxldCB0aWxlWSA9IE1hdGguZmxvb3IoeSAvIHRoaXMuVElMRV9TSVpFKTtcblxuICAgIHJldHVybiB7IHg6IHRpbGVYLCB5OiB0aWxlWSB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbGVTdXJmYWNlO1xuIiwiaW1wb3J0IERyYXdTdXJmYWNlIGZyb20gJy4vZHJhd19zdXJmYWNlJztcbmltcG9ydCBGaWxlSGFuZGxlciBmcm9tICcuL2ZpbGVfaGFuZGxlcic7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCBkcmF3Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbGUtbWFwJyk7XG4gIGxldCBkcmF3U3VyZmFjZSA9IG5ldyBEcmF3U3VyZmFjZShkcmF3Q29udGFpbmVyKTtcblxuICBsZXQgdG14RmlsZUhhbmRsZXIgPSBuZXcgRmlsZUhhbmRsZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RteC1maWxlJykpO1xufSk7XG4iXX0=
