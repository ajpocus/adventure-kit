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

  this.setupCanvas();
  this.drawBackground();
  this.initDrawSurface();

  this.container.addEventListener('mousemove', this.highlightPixel.bind(this),
                                  false);
  this.container.addEventListener('mouseout', this.clearHighlight.bind(this),
                                  false);
  this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                  false);
};

DrawSurface.prototype.setupCanvas = function () {
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
};

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

  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x * this.tileSize;
    var fillY = currentPixel.y * this.tileSize;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
    currentPixel.highlighted = true;
  }

  this.clearHighlight(null, currentPixel);
};

DrawSurface.prototype.clearHighlight = function (ev, currentPixel) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwicHVibGljL2pzL2ZpbGVfaGFuZGxlci5qcyIsInB1YmxpYy9qcy9waXhlbC5qcyIsInB1YmxpYy9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBpeGVsID0gcmVxdWlyZSgnLi9waXhlbCcpO1xuXG52YXIgRHJhd1N1cmZhY2UgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBwYXJhbXMpIHtcbiAgcGFyYW1zIHx8IChwYXJhbXMgPSB7fSk7XG4gIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkRyYXdTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIik7XG4gIH1cblxuICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoIHx8IDUxMjtcbiAgdGhpcy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0IHx8IDUxMjtcbiAgdGhpcy50aWxlU2l6ZSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAzMjtcbiAgdGhpcy5iZ1RpbGVTaXplID0gcGFyYW1zLmJnVGlsZVNpemUgfHwgODtcblxuICB0aGlzLnNldHVwQ2FudmFzKCk7XG4gIHRoaXMuZHJhd0JhY2tncm91bmQoKTtcbiAgdGhpcy5pbml0RHJhd1N1cmZhY2UoKTtcblxuICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhpZ2hsaWdodFBpeGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuY2xlYXJIaWdobGlnaHQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMucGFpbnRQaXhlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbn07XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5zZXR1cENhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5iZ0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICB0aGlzLmJnQ2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLndpZHRoKTtcbiAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iZ0NhbnZhcyk7XG5cbiAgdGhpcy5kcmF3Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy53aWR0aCk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kcmF3Q2FudmFzKTtcblxuICB0aGlzLm92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5vdmVybGF5Q2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLndpZHRoKTtcbiAgdGhpcy5vdmVybGF5Q2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXlDYW52YXMpO1xuXG4gIHRoaXMuYmdDdHggPSB0aGlzLmJnQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIHRoaXMuZHJhd0N0eCA9IHRoaXMuZHJhd0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB0aGlzLm92ZXJsYXlDdHggPSB0aGlzLm92ZXJsYXlDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn07XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5kcmF3QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG51bVRpbGVzSG9yaXogPSB0aGlzLndpZHRoIC8gdGhpcy5iZ1RpbGVTaXplO1xuICB2YXIgbnVtVGlsZXNWZXJ0ID0gdGhpcy5oZWlnaHQgLyB0aGlzLmJnVGlsZVNpemU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UaWxlc0hvcml6OyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bVRpbGVzVmVydDsgaisrKSB7XG4gICAgICB2YXIgeCA9IGkgKiB0aGlzLmJnVGlsZVNpemU7XG4gICAgICB2YXIgeSA9IGogKiB0aGlzLmJnVGlsZVNpemU7XG5cbiAgICAgIHZhciBmaWxsID0gKChpICsgaikgJSAyID09IDApID8gXCIjOTk5XCIgOiBcIiM3NzdcIjtcblxuICAgICAgdGhpcy5iZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgdGhpcy5iZ0N0eC5maWxsUmVjdCh4LCB5LCB0aGlzLmJnVGlsZVNpemUsIHRoaXMuYmdUaWxlU2l6ZSk7XG4gICAgfVxuICB9XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuaW5pdERyYXdTdXJmYWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbnVtUGl4ZWxzSG9yaXogPSB0aGlzLndpZHRoIC8gdGhpcy50aWxlU2l6ZTtcbiAgdmFyIG51bVBpeGVsc1ZlcnQgPSB0aGlzLmhlaWdodCAvIHRoaXMudGlsZVNpemU7XG4gIHRoaXMuZ3JpZCA9IFtdO1xuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgbnVtUGl4ZWxzSG9yaXo7IHgrKykge1xuICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBudW1QaXhlbHNWZXJ0OyB5KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgfVxuICB9XG59XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5nZXRQaXhlbENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBhYnNYID0gZXYuY2xpZW50WDtcbiAgdmFyIGFic1kgPSBldi5jbGllbnRZO1xuICB2YXIgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgdmFyIHkgPSBhYnNZIC0gZWxSZWN0LnRvcDtcblxuICB2YXIgcGl4ZWxYID0gTWF0aC5mbG9vcih4IC8gdGhpcy50aWxlU2l6ZSk7XG4gIHZhciBwaXhlbFkgPSBNYXRoLmZsb29yKHkgLyB0aGlzLnRpbGVTaXplKTtcblxuICByZXR1cm4geyB4OiBwaXhlbFgsIHk6IHBpeGVsWSB9O1xufVxuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuaGlnaGxpZ2h0UGl4ZWwgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0UGl4ZWxDb29yZGluYXRlcyhldik7XG4gIHZhciB4ID0gY29vcmRzLng7XG4gIHZhciB5ID0gY29vcmRzLnk7XG4gIHZhciBudW1QaXhlbHMgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXG4gIHZhciBjdXJyZW50UGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG4gIGlmICghY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgdmFyIGZpbGxYID0gY3VycmVudFBpeGVsLnggKiB0aGlzLnRpbGVTaXplO1xuICAgIHZhciBmaWxsWSA9IGN1cnJlbnRQaXhlbC55ICogdGhpcy50aWxlU2l6ZTtcblxuICAgIHRoaXMub3ZlcmxheUN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiO1xuICAgIHRoaXMub3ZlcmxheUN0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUpO1xuICAgIGN1cnJlbnRQaXhlbC5oaWdobGlnaHRlZCA9IHRydWU7XG4gIH1cblxuICB0aGlzLmNsZWFySGlnaGxpZ2h0KG51bGwsIGN1cnJlbnRQaXhlbCk7XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuY2xlYXJIaWdobGlnaHQgPSBmdW5jdGlvbiAoZXYsIGN1cnJlbnRQaXhlbCkge1xuICB2YXIgbnVtUGl4ZWxzSG9yaXogPSB0aGlzLndpZHRoIC8gdGhpcy50aWxlU2l6ZTtcbiAgdmFyIG51bVBpeGVsc1ZlcnQgPSB0aGlzLmhlaWdodCAvIHRoaXMudGlsZVNpemU7XG4gIGZvciAodmFyIGl4ID0gMDsgaXggPCBudW1QaXhlbHNIb3JpejsgaXgrKykge1xuICAgIGZvciAodmFyIGl5ID0gMDsgaXkgPCBudW1QaXhlbHNWZXJ0OyBpeSsrKSB7XG4gICAgICB2YXIgcGl4ZWwgPSB0aGlzLmdyaWRbaXhdW2l5XTtcbiAgICAgIGlmIChwaXhlbCA9PT0gY3VycmVudFBpeGVsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGl4ZWwuaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgdmFyIGNsclggPSBwaXhlbC54ICogdGhpcy50aWxlU2l6ZTtcbiAgICAgICAgdmFyIGNsclkgPSBwaXhlbC55ICogdGhpcy50aWxlU2l6ZTtcblxuICAgICAgICB0aGlzLm92ZXJsYXlDdHguY2xlYXJSZWN0KGNsclgsIGNsclksIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUpO1xuICAgICAgICBwaXhlbC5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLnBhaW50UGl4ZWwgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0UGl4ZWxDb29yZGluYXRlcyhldik7XG4gIHZhciB4ID0gY29vcmRzLng7XG4gIHZhciB5ID0gY29vcmRzLnk7XG4gIHZhciBjb2xvciA9IFwiIzAwMDAwMFwiO1xuICB2YXIgcGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG5cbiAgdmFyIGZpbGxYID0geCAqIHRoaXMudGlsZVNpemU7XG4gIHZhciBmaWxsWSA9IHkgKiB0aGlzLnRpbGVTaXplO1xuICB0aGlzLmRyYXdDdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIHRoaXMuZHJhd0N0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUpO1xuICBwaXhlbC5jb2xvciA9IGNvbG9yO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRHJhd1N1cmZhY2U7XG4iLCJ2YXIgRmlsZUhhbmRsZXIgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdGhpcy5lbCA9IGVsO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRmlsZUhhbmRsZXI7XG4iLCJ2YXIgUGl4ZWwgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gIHRoaXMuY29sb3IgPSBudWxsO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUGl4ZWw7XG4iLCJ2YXIgRHJhd1N1cmZhY2UgPSByZXF1aXJlKCcuL2RyYXdfc3VyZmFjZScpO1xudmFyIEZpbGVIYW5kbGVyID0gcmVxdWlyZSgnLi9maWxlX2hhbmRsZXInKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRyYXdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGlsZS1tYXAnKTtcbiAgdmFyIGRyYXdTdXJmYWNlID0gbmV3IERyYXdTdXJmYWNlKGRyYXdDb250YWluZXIpO1xuXG4gIHZhciB0bXhGaWxlSGFuZGxlciA9IG5ldyBGaWxlSGFuZGxlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG14LWZpbGUnKSk7XG59KTtcbiJdfQ==
