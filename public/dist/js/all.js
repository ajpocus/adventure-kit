(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FileHandler = (function () {
  function FileHandler(el) {
    _classCallCheck(this, FileHandler);

    this.el = el;
    this.el.addEventListener('onchange', this.fileLoaded.bind(this), false);
  }

  _createClass(FileHandler, [{
    key: 'fileLoaded',
    value: function fileLoaded(ev) {
      console.log(ev);
      var file = el.files[0];
      this.reader = new FileReader();

      reader.onload = this.onload || null;
      reader.readAsText(file);
    }
  }]);

  return FileHandler;
})();

exports['default'] = FileHandler;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _tile_surface = require("./tile_surface");

var _tile_surface2 = _interopRequireDefault(_tile_surface);

var RenderSurface = (function (_TileSurface) {
  function RenderSurface(container, params) {
    _classCallCheck(this, RenderSurface);

    _get(Object.getPrototypeOf(RenderSurface.prototype), "constructor", this).call(this, container, params);

    params || (params = {});
    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
  }

  _inherits(RenderSurface, _TileSurface);

  return RenderSurface;
})(_tile_surface2["default"]);

;

exports["default"] = RenderSurface;
module.exports = exports["default"];

},{"./tile_surface":4}],4:[function(require,module,exports){
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

},{"./pixel":2}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _file_handler = require('./file_handler');

var _file_handler2 = _interopRequireDefault(_file_handler);

var _render_surface = require('./render_surface');

var _render_surface2 = _interopRequireDefault(_render_surface);

document.addEventListener('DOMContentLoaded', function () {
  var renderSurface = new _render_surface2['default'](document.getElementById('render'));
  var tmxFileHandler = new _file_handler2['default'](document.getElementById('tmx-file'));
  tmxFileHandler.onload = function () {
    console.log(this.reader.result);
  };
});

},{"./file_handler":1,"./render_surface":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvZmlsZV9oYW5kbGVyLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3BpeGVsLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3JlbmRlcl9zdXJmYWNlLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3RpbGVfc3VyZmFjZS5qcyIsIi9ob21lL2F1c3Rpbi9wcm9qZWN0cy9hZHZlbnR1cmUta2l0L3B1YmxpYy9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sV0FBVztBQUNILFdBRFIsV0FBVyxDQUNGLEVBQUUsRUFBRTswQkFEYixXQUFXOztBQUViLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDekU7O2VBSkcsV0FBVzs7V0FNSixvQkFBQyxFQUFFLEVBQUU7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLFVBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOztBQUUvQixZQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO0FBQ3BDLFlBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFD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QUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTNDLGFBQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztLQUMvQjs7O1NBM0RHLFdBQVc7OztxQkE4REYsV0FBVzs7Ozs7Ozs7NEJDaEVGLGdCQUFnQjs7Ozs4QkFDZCxrQkFBa0I7Ozs7QUFFNUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVk7QUFDeEQsTUFBSSxhQUFhLEdBQUcsZ0NBQWtCLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN6RSxNQUFJLGNBQWMsR0FBRyw4QkFBZ0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGdCQUFjLENBQUMsTUFBTSxHQUFHLFlBQVk7QUFDbEMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ2pDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgRmlsZUhhbmRsZXIge1xuICBjb25zdHJ1Y3RvciAoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdvbmNoYW5nZScsIHRoaXMuZmlsZUxvYWRlZC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBmaWxlTG9hZGVkIChldikge1xuICAgIGNvbnNvbGUubG9nKGV2KTtcbiAgICBsZXQgZmlsZSA9IGVsLmZpbGVzWzBdO1xuICAgIHRoaXMucmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgIHJlYWRlci5vbmxvYWQgPSB0aGlzLm9ubG9hZCB8fCBudWxsO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVIYW5kbGVyO1xuIiwiY2xhc3MgUGl4ZWwge1xuICBjb25zdHJ1Y3RvciAoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb2xvciA9IG51bGw7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBpeGVsO1xuIiwiaW1wb3J0IFRpbGVTdXJmYWNlIGZyb20gJy4vdGlsZV9zdXJmYWNlJztcblxuY2xhc3MgUmVuZGVyU3VyZmFjZSBleHRlbmRzIFRpbGVTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IgKGNvbnRhaW5lciwgcGFyYW1zKSB7XG4gICAgc3VwZXIoY29udGFpbmVyLCBwYXJhbXMpO1xuXG4gICAgcGFyYW1zIHx8IChwYXJhbXMgPSB7fSk7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkRyYXdTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIik7XG4gICAgfVxuXG4gICAgdGhpcy53aWR0aCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gICAgdGhpcy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0IHx8IDUxMjtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyU3VyZmFjZTtcbiIsImltcG9ydCBQaXhlbCBmcm9tICcuL3BpeGVsJztcblxuY2xhc3MgVGlsZVN1cmZhY2Uge1xuICBjb25zdHJ1Y3RvciAoY29udGFpbmVyLCBwYXJhbXM9e30pIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyB7XG4gICAgICAgIG5hbWU6IFwiVGlsZVN1cmZhY2VFeGNlcHRpb25cIixcbiAgICAgICAgbWVzc2FnZTogXCJUaWxlU3VyZmFjZSByZXF1aXJlcyBhIGNvbnRhaW5lciBwYXJhbWV0ZXIuXCIsXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiBgJHt0aGlzLm5hbWV9OiAke3RoaXMubWVzc2FnZX1gOyB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuV0lEVEggPSBwYXJhbXMud2lkdGggfHwgNTEyO1xuICAgIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gICAgdGhpcy5USUxFX1NJWkUgPSBwYXJhbXMudGlsZVNpemUgfHwgMzI7XG5cbiAgICB0aGlzLmluaXRDYW52YXMoKTtcbiAgICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG4gICAgdGhpcy5pbml0VGlsZXMoKTtcbiAgfVxuXG4gIGluaXRDYW52YXMgKCkge1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICAgIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5IRUlHSFQpO1xuXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgfVxuXG4gIGluaXRCYWNrZ3JvdW5kICgpIHtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLldJRFRILCB0aGlzLkhFSUdIVCk7XG4gIH1cblxuICBpbml0VGlsZXMgKCkge1xuICAgIGNvbnN0IE5VTV9USUxFU19IT1JJWiA9IHRoaXMuV0lEVEggLyB0aGlzLlRJTEVfU0laRTtcbiAgICBjb25zdCBOVU1fVElMRVNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gICAgdGhpcy5ncmlkID0gW107XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IE5VTV9USUxFU19IT1JJWjsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBbXTtcblxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBOVU1fVElMRVNfVkVSVDsgeSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0VGlsZUNvb3JkaW5hdGVzIChldikge1xuICAgIGxldCBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IGFic1ggPSBldi5jbGllbnRYO1xuICAgIGxldCBhYnNZID0gZXYuY2xpZW50WTtcbiAgICBsZXQgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgICBsZXQgeSA9IGFic1kgLSBlbFJlY3QudG9wO1xuXG4gICAgbGV0IHRpbGVYID0gTWF0aC5mbG9vcih4IC8gdGhpcy5USUxFX1NJWkUpO1xuICAgIGxldCB0aWxlWSA9IE1hdGguZmxvb3IoeSAvIHRoaXMuVElMRV9TSVpFKTtcblxuICAgIHJldHVybiB7IHg6IHRpbGVYLCB5OiB0aWxlWSB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbGVTdXJmYWNlO1xuIiwiaW1wb3J0IEZpbGVIYW5kbGVyIGZyb20gJy4vZmlsZV9oYW5kbGVyJztcbmltcG9ydCBSZW5kZXJTdXJmYWNlIGZyb20gJy4vcmVuZGVyX3N1cmZhY2UnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBsZXQgcmVuZGVyU3VyZmFjZSA9IG5ldyBSZW5kZXJTdXJmYWNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXInKSk7XG4gIGxldCB0bXhGaWxlSGFuZGxlciA9IG5ldyBGaWxlSGFuZGxlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG14LWZpbGUnKSk7XG4gIHRteEZpbGVIYW5kbGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnJlYWRlci5yZXN1bHQpO1xuICB9O1xufSk7XG4iXX0=
