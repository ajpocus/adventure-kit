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
});

},{"./draw_surface":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3BpeGVsLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O3FCQ0FrQixTQUFTOzs7O0lBRXJCLFdBQVc7QUFDSCxXQURSLFdBQVcsQ0FDRixTQUFTLEVBQWE7UUFBWCxNQUFNLGdDQUFDLEVBQUU7OzBCQUQ3QixXQUFXOztBQUViLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLFlBQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztLQUNwRTs7QUFFRCxRQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDbkMsUUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN2QyxRQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDOztBQUUzQyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsUUFBUSxDQUFD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Ozs7Ozs7Ozs7Ozs7SUN2SXBCLEtBQUssR0FDRyxTQURSLEtBQUssQ0FDSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dCQURmLEtBQUs7O0FBRVAsTUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxNQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLE1BQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0NBQ25COztBQUNGLENBQUM7O3FCQUVhLEtBQUs7Ozs7QUNUcEIsWUFBWSxDQUFDOzs7OzRCQUVXLGdCQUFnQjs7OztBQUV4QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN4RCxNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELE1BQUksV0FBVyxHQUFHLDhCQUFnQixhQUFhLENBQUMsQ0FBQztDQUNsRCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBpeGVsIGZyb20gJy4vcGl4ZWwnO1xuXG5jbGFzcyBEcmF3U3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yIChjb250YWluZXIsIHBhcmFtcz17fSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIGlmICghdGhpcy5jb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJEcmF3U3VyZmFjZSByZXF1aXJlcyBhIGNvbnRhaW5lciBwYXJhbWV0ZXIuXCIpO1xuICAgIH1cblxuICAgIHRoaXMuV0lEVEggPSBwYXJhbXMud2lkdGggfHwgNTEyO1xuICAgIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gICAgdGhpcy5USUxFX1NJWkUgPSBwYXJhbXMudGlsZVNpemUgfHwgMzI7XG4gICAgdGhpcy5CR19USUxFX1NJWkUgPSBwYXJhbXMuYmdUaWxlU2l6ZSB8fCA4O1xuXG4gICAgdGhpcy5iZ0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuYmdDYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMuYmdDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLkhFSUdIVCk7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iZ0NhbnZhcyk7XG5cbiAgICB0aGlzLmRyYXdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmRyYXdDYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRyYXdDYW52YXMpO1xuXG4gICAgdGhpcy5vdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5vdmVybGF5Q2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLldJRFRIKTtcbiAgICB0aGlzLm92ZXJsYXlDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLkhFSUdIVCk7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5Q2FudmFzKTtcblxuICAgIHRoaXMuYmdDdHggPSB0aGlzLmJnQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5kcmF3Q3R4ID0gdGhpcy5kcmF3Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5vdmVybGF5Q3R4ID0gdGhpcy5vdmVybGF5Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmRyYXdCYWNrZ3JvdW5kKCk7XG4gICAgdGhpcy5pbml0RHJhd1N1cmZhY2UoKTtcblxuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGlnaGxpZ2h0UGl4ZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnBhaW50UGl4ZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgfVxuXG4gIGRyYXdCYWNrZ3JvdW5kICgpIHtcbiAgICBjb25zdCBOVU1fVElMRVNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5CR19USUxFX1NJWkU7XG4gICAgY29uc3QgTlVNX1RJTEVTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuQkdfVElMRV9TSVpFO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1fVElMRVNfSE9SSVo7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBOVU1fVElMRVNfVkVSVDsgaisrKSB7XG4gICAgICAgIGxldCB4ID0gaSAqIHRoaXMuQkdfVElMRV9TSVpFO1xuICAgICAgICBsZXQgeSA9IGogKiB0aGlzLkJHX1RJTEVfU0laRTtcblxuICAgICAgICBsZXQgZmlsbCA9ICgoaSArIGopICUgMiA9PSAwKSA/IFwiIzk5OVwiIDogXCIjNzc3XCI7XG5cbiAgICAgICAgdGhpcy5iZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgICB0aGlzLmJnQ3R4LmZpbGxSZWN0KHgsIHksIHRoaXMuQkdfVElMRV9TSVpFLCB0aGlzLkJHX1RJTEVfU0laRSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdERyYXdTdXJmYWNlICgpIHtcbiAgICBjb25zdCBOVU1fUElYRUxTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuVElMRV9TSVpFO1xuICAgIGNvbnN0IE5VTV9QSVhFTFNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgdGhpcy5ncmlkID0gW107XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IE5VTV9QSVhFTFNfSE9SSVo7IHgrKykge1xuICAgICAgdGhpcy5ncmlkW3hdID0gW107XG5cbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgTlVNX1BJWEVMU19WRVJUOyB5KyspIHtcbiAgICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQaXhlbENvb3JkaW5hdGVzIChldikge1xuICAgIGxldCBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IGFic1ggPSBldi5jbGllbnRYO1xuICAgIGxldCBhYnNZID0gZXYuY2xpZW50WTtcbiAgICBsZXQgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgICBsZXQgeSA9IGFic1kgLSBlbFJlY3QudG9wO1xuXG4gICAgbGV0IHBpeGVsWCA9IE1hdGguZmxvb3IoeCAvIHRoaXMuVElMRV9TSVpFKTtcbiAgICBsZXQgcGl4ZWxZID0gTWF0aC5mbG9vcih5IC8gdGhpcy5USUxFX1NJWkUpO1xuXG4gICAgcmV0dXJuIFtwaXhlbFgsIHBpeGVsWV07XG4gIH1cblxuICBoaWdobGlnaHRQaXhlbCAoZXYpIHtcbiAgICBsZXQgW3gsIHldID0gdGhpcy5nZXRQaXhlbENvb3JkaW5hdGVzKGV2KTtcbiAgICBjb25zdCBOVU1fUElYRUxTID0gdGhpcy5ncmlkLmxlbmd0aDtcblxuICAgIC8vIGhpZ2hsaWdodCB0aGUgcGl4ZWwgdW5kZXIgdGhlIG1vdXNlXG4gICAgbGV0IGN1cnJlbnRQaXhlbCA9IHRoaXMuZ3JpZFt4XVt5XTtcbiAgICBpZiAoIWN1cnJlbnRQaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgbGV0IGZpbGxYID0gY3VycmVudFBpeGVsLnggKiB0aGlzLlRJTEVfU0laRTtcbiAgICAgIGxldCBmaWxsWSA9IGN1cnJlbnRQaXhlbC55ICogdGhpcy5USUxFX1NJWkU7XG5cbiAgICAgIHRoaXMub3ZlcmxheUN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiO1xuICAgICAgdGhpcy5vdmVybGF5Q3R4LmZpbGxSZWN0KGZpbGxYLCBmaWxsWSwgdGhpcy5USUxFX1NJWkUsIHRoaXMuVElMRV9TSVpFKTtcbiAgICAgIGN1cnJlbnRQaXhlbC5oaWdobGlnaHRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gY2xlYXIgaGlnaGxpZ2h0aW5nIG9uIG90aGVyIHBpeGVsc1xuICAgIGxldCBOVU1fUElYRUxTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuVElMRV9TSVpFO1xuICAgIGxldCBOVU1fUElYRUxTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuVElMRV9TSVpFO1xuICAgIGZvciAobGV0IGl4ID0gMDsgaXggPCBOVU1fUElYRUxTX0hPUklaOyBpeCsrKSB7XG4gICAgICBmb3IgKGxldCBpeSA9IDA7IGl5IDwgTlVNX1BJWEVMU19WRVJUOyBpeSsrKSB7XG4gICAgICAgIGxldCBwaXhlbCA9IHRoaXMuZ3JpZFtpeF1baXldO1xuICAgICAgICBpZiAocGl4ZWwgPT09IGN1cnJlbnRQaXhlbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgICAgICAgbGV0IGNsclggPSBwaXhlbC54ICogdGhpcy5USUxFX1NJWkU7XG4gICAgICAgICAgbGV0IGNsclkgPSBwaXhlbC55ICogdGhpcy5USUxFX1NJWkU7XG5cbiAgICAgICAgICB0aGlzLm92ZXJsYXlDdHguY2xlYXJSZWN0KGNsclgsIGNsclksIHRoaXMuVElMRV9TSVpFLCB0aGlzLlRJTEVfU0laRSk7XG4gICAgICAgICAgcGl4ZWwuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBhaW50UGl4ZWwgKGV2KSB7XG4gICAgbGV0IFt4LCB5XSA9IHRoaXMuZ2V0UGl4ZWxDb29yZGluYXRlcyhldik7XG4gICAgbGV0IGNvbG9yID0gXCIjMDAwMDAwXCI7XG4gICAgbGV0IHBpeGVsID0gdGhpcy5ncmlkW3hdW3ldO1xuXG4gICAgbGV0IGZpbGxYID0geCAqIHRoaXMuVElMRV9TSVpFO1xuICAgIGxldCBmaWxsWSA9IHkgKiB0aGlzLlRJTEVfU0laRTtcbiAgICB0aGlzLmRyYXdDdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgdGhpcy5kcmF3Q3R4LmZpbGxSZWN0KGZpbGxYLCBmaWxsWSwgdGhpcy5USUxFX1NJWkUsIHRoaXMuVElMRV9TSVpFKTtcbiAgICBwaXhlbC5jb2xvciA9IGNvbG9yO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERyYXdTdXJmYWNlO1xuIiwiY2xhc3MgUGl4ZWwge1xuICBjb25zdHJ1Y3RvciAoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb2xvciA9IG51bGw7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBpeGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRHJhd1N1cmZhY2UgZnJvbSAnLi9kcmF3X3N1cmZhY2UnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBsZXQgZHJhd0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmF3Jyk7XG4gIGxldCBkcmF3U3VyZmFjZSA9IG5ldyBEcmF3U3VyZmFjZShkcmF3Q29udGFpbmVyKTtcbn0pO1xuIl19
