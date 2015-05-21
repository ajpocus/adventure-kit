(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileHandler = (function () {
  function FileHandler(el) {
    _classCallCheck(this, FileHandler);

    this.el = el;
    this.el.onchange = this.fileLoaded.bind(this);
  }

  _createClass(FileHandler, [{
    key: "fileLoaded",
    value: function fileLoaded(ev) {
      var file = this.el.files[0];
      var reader = new FileReader();

      reader.onload = this.onload || null;
      reader.readAsText(file);
    }
  }]);

  return FileHandler;
})();

exports["default"] = FileHandler;
module.exports = exports["default"];

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

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TMX = function TMX(text) {
  _classCallCheck(this, TMX);

  this.text = text;
  var parser = new DOMParser();
  var tree = parser.parseFromString(this.text, 'text/xml');
  window.tmx = tree;
  this.tree = {};

  var mapNode = this.tree.children[0];
  tree.map = {
    width: mapNode.getAttribute('width'),
    height: mapNode.getAttribute('height'),
    tilewidth: mapNode.getAttribute('tilewidth'),
    tileheight: mapNode.getAttribute('tileheight')
  };
};

exports['default'] = TMX;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _file_handler = require('./file_handler');

var _file_handler2 = _interopRequireDefault(_file_handler);

var _render_surface = require('./render_surface');

var _render_surface2 = _interopRequireDefault(_render_surface);

var _tmx = require('./tmx');

var _tmx2 = _interopRequireDefault(_tmx);

document.addEventListener('DOMContentLoaded', function () {
  var renderSurface = new _render_surface2['default'](document.getElementById('render'));
  var tmxFileHandler = new _file_handler2['default'](document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    var tmx = new _tmx2['default'](this.result);
  };
});

},{"./file_handler":1,"./render_surface":3,"./tmx":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvZmlsZV9oYW5kbGVyLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3BpeGVsLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3JlbmRlcl9zdXJmYWNlLmpzIiwiL2hvbWUvYXVzdGluL3Byb2plY3RzL2FkdmVudHVyZS1raXQvcHVibGljL2pzL3RpbGVfc3VyZmFjZS5qcyIsIi9ob21lL2F1c3Rpbi9wcm9qZWN0cy9hZHZlbnR1cmUta2l0L3B1YmxpYy9qcy90bXguanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FNLFdBQVc7QUFDSCxXQURSLFdBQVcsQ0FDRixFQUFFLEVBQUU7MEJBRGIsV0FBVzs7QUFFYixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQy9DOztlQUpHLFdBQVc7O1dBTUosb0JBQUMsRUFBRSxFQUFFO0FBQ2QsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsVUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQzs7QUFFOUIsWUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztBQUNwQyxZQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tB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QUFDLENBQUMsQ0FBQztBQUN6RSxNQUFJLGNBQWMsR0FBRyw4QkFBZ0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOztBQUUxRSxnQkFBYyxDQUFDLE1BQU0sR0FBRyxZQUFZO0FBQ2xDLFFBQUksR0FBRyxHQUFHLHFCQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNoQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEZpbGVIYW5kbGVyIHtcbiAgY29uc3RydWN0b3IgKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuZWwub25jaGFuZ2UgPSB0aGlzLmZpbGVMb2FkZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGZpbGVMb2FkZWQgKGV2KSB7XG4gICAgbGV0IGZpbGUgPSB0aGlzLmVsLmZpbGVzWzBdO1xuICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgcmVhZGVyLm9ubG9hZCA9IHRoaXMub25sb2FkIHx8IG51bGw7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmlsZUhhbmRsZXI7XG4iLCJjbGFzcyBQaXhlbCB7XG4gIGNvbnN0cnVjdG9yICh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbG9yID0gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGl4ZWw7XG4iLCJpbXBvcnQgVGlsZVN1cmZhY2UgZnJvbSAnLi90aWxlX3N1cmZhY2UnO1xuXG5jbGFzcyBSZW5kZXJTdXJmYWNlIGV4dGVuZHMgVGlsZVN1cmZhY2Uge1xuICBjb25zdHJ1Y3RvciAoY29udGFpbmVyLCBwYXJhbXMpIHtcbiAgICBzdXBlcihjb250YWluZXIsIHBhcmFtcyk7XG5cbiAgICBwYXJhbXMgfHwgKHBhcmFtcyA9IHt9KTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiRHJhd1N1cmZhY2UgcmVxdWlyZXMgYSBjb250YWluZXIgcGFyYW1ldGVyLlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoIHx8IDUxMjtcbiAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQgfHwgNTEyO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJTdXJmYWNlO1xuIiwiaW1wb3J0IFBpeGVsIGZyb20gJy4vcGl4ZWwnO1xuXG5jbGFzcyBUaWxlU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yIChjb250YWluZXIsIHBhcmFtcz17fSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIGlmICghdGhpcy5jb250YWluZXIpIHtcbiAgICAgIHRocm93IHtcbiAgICAgICAgbmFtZTogXCJUaWxlU3VyZmFjZUV4Y2VwdGlvblwiLFxuICAgICAgICBtZXNzYWdlOiBcIlRpbGVTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIixcbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGAke3RoaXMubmFtZX06ICR7dGhpcy5tZXNzYWdlfWA7IH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5XSURUSCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gICAgdGhpcy5IRUlHSFQgPSBwYXJhbXMuaGVpZ2h0IHx8IDUxMjtcbiAgICB0aGlzLlRJTEVfU0laRSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAzMjtcblxuICAgIHRoaXMuaW5pdENhbnZhcygpO1xuICAgIHRoaXMuaW5pdEJhY2tncm91bmQoKTtcbiAgICB0aGlzLmluaXRUaWxlcygpO1xuICB9XG5cbiAgaW5pdENhbnZhcyAoKSB7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLkhFSUdIVCk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB9XG5cbiAgaW5pdEJhY2tncm91bmQgKCkge1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuV0lEVEgsIHRoaXMuSEVJR0hUKTtcbiAgfVxuXG4gIGluaXRUaWxlcyAoKSB7XG4gICAgY29uc3QgTlVNX1RJTEVTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuVElMRV9TSVpFO1xuICAgIGNvbnN0IE5VTV9USUxFU19WRVJUID0gdGhpcy5IRUlHSFQgLyB0aGlzLlRJTEVfU0laRTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgTlVNX1RJTEVTX0hPUklaOyB4KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuXG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IE5VTV9USUxFU19WRVJUOyB5KyspIHtcbiAgICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRUaWxlQ29vcmRpbmF0ZXMgKGV2KSB7XG4gICAgbGV0IGVsUmVjdCA9IGV2LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgYWJzWCA9IGV2LmNsaWVudFg7XG4gICAgbGV0IGFic1kgPSBldi5jbGllbnRZO1xuICAgIGxldCB4ID0gYWJzWCAtIGVsUmVjdC5sZWZ0O1xuICAgIGxldCB5ID0gYWJzWSAtIGVsUmVjdC50b3A7XG5cbiAgICBsZXQgdGlsZVggPSBNYXRoLmZsb29yKHggLyB0aGlzLlRJTEVfU0laRSk7XG4gICAgbGV0IHRpbGVZID0gTWF0aC5mbG9vcih5IC8gdGhpcy5USUxFX1NJWkUpO1xuXG4gICAgcmV0dXJuIHsgeDogdGlsZVgsIHk6IHRpbGVZIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZVN1cmZhY2U7XG4iLCJjbGFzcyBUTVgge1xuICBjb25zdHJ1Y3RvciAodGV4dCkge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgbGV0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICBsZXQgdHJlZSA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGhpcy50ZXh0LCBcInRleHQveG1sXCIpO1xuICAgIHdpbmRvdy50bXggPSB0cmVlO1xuICAgIHRoaXMudHJlZSA9IHt9O1xuXG4gICAgbGV0IG1hcE5vZGUgPSB0aGlzLnRyZWUuY2hpbGRyZW5bMF07XG4gICAgdHJlZS5tYXAgPSB7XG4gICAgICB3aWR0aDogbWFwTm9kZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyksXG4gICAgICBoZWlnaHQ6IG1hcE5vZGUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSxcbiAgICAgIHRpbGV3aWR0aDogbWFwTm9kZS5nZXRBdHRyaWJ1dGUoJ3RpbGV3aWR0aCcpLFxuICAgICAgdGlsZWhlaWdodDogbWFwTm9kZS5nZXRBdHRyaWJ1dGUoJ3RpbGVoZWlnaHQnKVxuICAgIH07XG5cblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRNWDtcbiIsImltcG9ydCBGaWxlSGFuZGxlciBmcm9tICcuL2ZpbGVfaGFuZGxlcic7XG5pbXBvcnQgUmVuZGVyU3VyZmFjZSBmcm9tICcuL3JlbmRlcl9zdXJmYWNlJztcbmltcG9ydCBUTVggZnJvbSAnLi90bXgnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBsZXQgcmVuZGVyU3VyZmFjZSA9IG5ldyBSZW5kZXJTdXJmYWNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXInKSk7XG4gIGxldCB0bXhGaWxlSGFuZGxlciA9IG5ldyBGaWxlSGFuZGxlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG14LWZpbGUnKSk7XG5cbiAgdG14RmlsZUhhbmRsZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCB0bXggPSBuZXcgVE1YKHRoaXMucmVzdWx0KTtcbiAgfTtcbn0pO1xuIl19
