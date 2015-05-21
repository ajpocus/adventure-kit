(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Pixel = require('./pixel');

var DrawSurface = function (container, params) {
  params || (params = {});
  this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
    this.tileSize = params.tileSize || 32;
    this.bgTileSize = params.bgTileSize || 8;

    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.setAttribute('width', this.width);
    this.bgCanvas.setAttribute('height', this.height);
    this.container.appendChild(this.bgCanvas);

    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.setAttribute('width', this.width);
    this.drawCanvas.setAttribute('height', this.height);
    this.container.appendChild(this.drawCanvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.setAttribute('width', this.width);
    this.overlayCanvas.setAttribute('height', this.height);
    this.container.appendChild(this.overlayCanvas);

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.drawCtx = this.drawCanvas.getContext('2d');
    this.overlayCtx = this.overlayCanvas.getContext('2d');

    this.drawBackground();
    this.initDrawSurface();

    this.container.addEventListener('mousemove', this.highlightPixel.bind(this),
                                    false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                    false);
}

DrawSurface.prototype.drawBackground = function () {
  var numTilesHoriz = this.width / this.bgTileSize;
  var numTilesVert = this.height / this.bgTileSize;

  for (var i = 0; i < numTilesHoriz; i++) {
    for (var j = 0; j < numTilesVert; j++) {
      var x = i * this.bgTileSize;
      var y = j * this.bgTileSize;

      var fill = ((i + j) % 2 == 0) ? "#999" : "#777";

      this.bgCtx.fillStyle = fill;
      this.bgCtx.fillRect(x, y, this.bgTileSize, this.bgTileSize);
    }
  }
};

DrawSurface.prototype.initDrawSurface = function () {
  var numPixelsHoriz = this.width / this.tileSize;
  var numPixelsVert = this.height / this.tileSize;
  this.grid = [];

  for (var x = 0; x < numPixelsHoriz; x++) {
    this.grid[x] = [];

    for (var y = 0; y < numPixelsVert; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
}

DrawSurface.prototype.getPixelCoordinates = function (ev) {
  var elRect = ev.target.getBoundingClientRect();
  var absX = ev.clientX;
  var absY = ev.clientY;
  var x = absX - elRect.left;
  var y = absY - elRect.top;

  var pixelX = Math.floor(x / this.tileSize);
  var pixelY = Math.floor(y / this.tileSize);

  return { x: pixelX, y: pixelY };
}

DrawSurface.prototype.highlightPixel = function (ev) {
  var coords = this.getPixelCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var numPixels = this.grid.length;

  // highlight the pixel under the mouse
  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x * this.tileSize;
    var fillY = currentPixel.y * this.tileSize;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
    currentPixel.highlighted = true;
  }

  // clear highlighting on other pixels
  var numPixelsHoriz = this.width / this.tileSize;
  var numPixelsVert = this.height / this.tileSize;
  for (var ix = 0; ix < numPixelsHoriz; ix++) {
    for (var iy = 0; iy < numPixelsVert; iy++) {
      var pixel = this.grid[ix][iy];
      if (pixel === currentPixel) {
        continue;
      }

      if (pixel.highlighted) {
        var clrX = pixel.x * this.tileSize;
        var clrY = pixel.y * this.tileSize;

        this.overlayCtx.clearRect(clrX, clrY, this.tileSize, this.tileSize);
        pixel.highlighted = false;
      }
    }
  }
};

DrawSurface.prototype.paintPixel = function (ev) {
  var coords = this.getPixelCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var color = "#000000";
  var pixel = this.grid[x][y];

  var fillX = x * this.tileSize;
  var fillY = y * this.tileSize;
  this.drawCtx.fillStyle = color;
  this.drawCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
  pixel.color = color;
};

exports = module.exports = DrawSurface;

},{"./pixel":3}],2:[function(require,module,exports){
var FileHandler = function (el) {
  this.el = el;
};

exports = module.exports = FileHandler;

},{}],3:[function(require,module,exports){
var Pixel = function (x, y) {
  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

exports = module.exports = Pixel;

},{}],4:[function(require,module,exports){
var DrawSurface = require('./draw_surface');
var FileHandler = require('./file_handler');

document.addEventListener('DOMContentLoaded', function () {
  var drawContainer = document.getElementById('tile-map');
  var drawSurface = new DrawSurface(drawContainer);

  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));
});

},{"./draw_surface":1,"./file_handler":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwicHVibGljL2pzL2ZpbGVfaGFuZGxlci5qcyIsInB1YmxpYy9qcy9waXhlbC5qcyIsInB1YmxpYy9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQaXhlbCA9IHJlcXVpcmUoJy4vcGl4ZWwnKTtcblxudmFyIERyYXdTdXJmYWNlID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgcGFyYW1zKSB7XG4gIHBhcmFtcyB8fCAocGFyYW1zID0ge30pO1xuICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiRHJhd1N1cmZhY2UgcmVxdWlyZXMgYSBjb250YWluZXIgcGFyYW1ldGVyLlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoIHx8IDUxMjtcbiAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQgfHwgNTEyO1xuICAgIHRoaXMudGlsZVNpemUgPSBwYXJhbXMudGlsZVNpemUgfHwgMzI7XG4gICAgdGhpcy5iZ1RpbGVTaXplID0gcGFyYW1zLmJnVGlsZVNpemUgfHwgODtcblxuICAgIHRoaXMuYmdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmJnQ2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLndpZHRoKTtcbiAgICB0aGlzLmJnQ2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYmdDYW52YXMpO1xuXG4gICAgdGhpcy5kcmF3Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5kcmF3Q2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLndpZHRoKTtcbiAgICB0aGlzLmRyYXdDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kcmF3Q2FudmFzKTtcblxuICAgIHRoaXMub3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy53aWR0aCk7XG4gICAgdGhpcy5vdmVybGF5Q2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheUNhbnZhcyk7XG5cbiAgICB0aGlzLmJnQ3R4ID0gdGhpcy5iZ0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuZHJhd0N0eCA9IHRoaXMuZHJhd0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMub3ZlcmxheUN0eCA9IHRoaXMub3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5kcmF3QmFja2dyb3VuZCgpO1xuICAgIHRoaXMuaW5pdERyYXdTdXJmYWNlKCk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhpZ2hsaWdodFBpeGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5wYWludFBpeGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG59XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5kcmF3QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG51bVRpbGVzSG9yaXogPSB0aGlzLndpZHRoIC8gdGhpcy5iZ1RpbGVTaXplO1xuICB2YXIgbnVtVGlsZXNWZXJ0ID0gdGhpcy5oZWlnaHQgLyB0aGlzLmJnVGlsZVNpemU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UaWxlc0hvcml6OyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bVRpbGVzVmVydDsgaisrKSB7XG4gICAgICB2YXIgeCA9IGkgKiB0aGlzLmJnVGlsZVNpemU7XG4gICAgICB2YXIgeSA9IGogKiB0aGlzLmJnVGlsZVNpemU7XG5cbiAgICAgIHZhciBmaWxsID0gKChpICsgaikgJSAyID09IDApID8gXCIjOTk5XCIgOiBcIiM3NzdcIjtcblxuICAgICAgdGhpcy5iZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgdGhpcy5iZ0N0eC5maWxsUmVjdCh4LCB5LCB0aGlzLmJnVGlsZVNpemUsIHRoaXMuYmdUaWxlU2l6ZSk7XG4gICAgfVxuICB9XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuaW5pdERyYXdTdXJmYWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbnVtUGl4ZWxzSG9yaXogPSB0aGlzLndpZHRoIC8gdGhpcy50aWxlU2l6ZTtcbiAgdmFyIG51bVBpeGVsc1ZlcnQgPSB0aGlzLmhlaWdodCAvIHRoaXMudGlsZVNpemU7XG4gIHRoaXMuZ3JpZCA9IFtdO1xuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgbnVtUGl4ZWxzSG9yaXo7IHgrKykge1xuICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBudW1QaXhlbHNWZXJ0OyB5KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgfVxuICB9XG59XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5nZXRQaXhlbENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBhYnNYID0gZXYuY2xpZW50WDtcbiAgdmFyIGFic1kgPSBldi5jbGllbnRZO1xuICB2YXIgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgdmFyIHkgPSBhYnNZIC0gZWxSZWN0LnRvcDtcblxuICB2YXIgcGl4ZWxYID0gTWF0aC5mbG9vcih4IC8gdGhpcy50aWxlU2l6ZSk7XG4gIHZhciBwaXhlbFkgPSBNYXRoLmZsb29yKHkgLyB0aGlzLnRpbGVTaXplKTtcblxuICByZXR1cm4geyB4OiBwaXhlbFgsIHk6IHBpeGVsWSB9O1xufVxuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuaGlnaGxpZ2h0UGl4ZWwgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0UGl4ZWxDb29yZGluYXRlcyhldik7XG4gIHZhciB4ID0gY29vcmRzLng7XG4gIHZhciB5ID0gY29vcmRzLnk7XG4gIHZhciBudW1QaXhlbHMgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXG4gIC8vIGhpZ2hsaWdodCB0aGUgcGl4ZWwgdW5kZXIgdGhlIG1vdXNlXG4gIHZhciBjdXJyZW50UGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG4gIGlmICghY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgdmFyIGZpbGxYID0gY3VycmVudFBpeGVsLnggKiB0aGlzLnRpbGVTaXplO1xuICAgIHZhciBmaWxsWSA9IGN1cnJlbnRQaXhlbC55ICogdGhpcy50aWxlU2l6ZTtcblxuICAgIHRoaXMub3ZlcmxheUN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiO1xuICAgIHRoaXMub3ZlcmxheUN0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUpO1xuICAgIGN1cnJlbnRQaXhlbC5oaWdobGlnaHRlZCA9IHRydWU7XG4gIH1cblxuICAvLyBjbGVhciBoaWdobGlnaHRpbmcgb24gb3RoZXIgcGl4ZWxzXG4gIHZhciBudW1QaXhlbHNIb3JpeiA9IHRoaXMud2lkdGggLyB0aGlzLnRpbGVTaXplO1xuICB2YXIgbnVtUGl4ZWxzVmVydCA9IHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlU2l6ZTtcbiAgZm9yICh2YXIgaXggPSAwOyBpeCA8IG51bVBpeGVsc0hvcml6OyBpeCsrKSB7XG4gICAgZm9yICh2YXIgaXkgPSAwOyBpeSA8IG51bVBpeGVsc1ZlcnQ7IGl5KyspIHtcbiAgICAgIHZhciBwaXhlbCA9IHRoaXMuZ3JpZFtpeF1baXldO1xuICAgICAgaWYgKHBpeGVsID09PSBjdXJyZW50UGl4ZWwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgICB2YXIgY2xyWCA9IHBpeGVsLnggKiB0aGlzLnRpbGVTaXplO1xuICAgICAgICB2YXIgY2xyWSA9IHBpeGVsLnkgKiB0aGlzLnRpbGVTaXplO1xuXG4gICAgICAgIHRoaXMub3ZlcmxheUN0eC5jbGVhclJlY3QoY2xyWCwgY2xyWSwgdGhpcy50aWxlU2l6ZSwgdGhpcy50aWxlU2l6ZSk7XG4gICAgICAgIHBpeGVsLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUucGFpbnRQaXhlbCA9IGZ1bmN0aW9uIChldikge1xuICB2YXIgY29vcmRzID0gdGhpcy5nZXRQaXhlbENvb3JkaW5hdGVzKGV2KTtcbiAgdmFyIHggPSBjb29yZHMueDtcbiAgdmFyIHkgPSBjb29yZHMueTtcbiAgdmFyIGNvbG9yID0gXCIjMDAwMDAwXCI7XG4gIHZhciBwaXhlbCA9IHRoaXMuZ3JpZFt4XVt5XTtcblxuICB2YXIgZmlsbFggPSB4ICogdGhpcy50aWxlU2l6ZTtcbiAgdmFyIGZpbGxZID0geSAqIHRoaXMudGlsZVNpemU7XG4gIHRoaXMuZHJhd0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgdGhpcy5kcmF3Q3R4LmZpbGxSZWN0KGZpbGxYLCBmaWxsWSwgdGhpcy50aWxlU2l6ZSwgdGhpcy50aWxlU2l6ZSk7XG4gIHBpeGVsLmNvbG9yID0gY29sb3I7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBEcmF3U3VyZmFjZTtcbiIsInZhciBGaWxlSGFuZGxlciA9IGZ1bmN0aW9uIChlbCkge1xuICB0aGlzLmVsID0gZWw7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBGaWxlSGFuZGxlcjtcbiIsInZhciBQaXhlbCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG4gIHRoaXMuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgdGhpcy5jb2xvciA9IG51bGw7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBQaXhlbDtcbiIsInZhciBEcmF3U3VyZmFjZSA9IHJlcXVpcmUoJy4vZHJhd19zdXJmYWNlJyk7XG52YXIgRmlsZUhhbmRsZXIgPSByZXF1aXJlKCcuL2ZpbGVfaGFuZGxlcicpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICB2YXIgZHJhd0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aWxlLW1hcCcpO1xuICB2YXIgZHJhd1N1cmZhY2UgPSBuZXcgRHJhd1N1cmZhY2UoZHJhd0NvbnRhaW5lcik7XG5cbiAgdmFyIHRteEZpbGVIYW5kbGVyID0gbmV3IEZpbGVIYW5kbGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0bXgtZmlsZScpKTtcbn0pO1xuIl19
