(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports = module.exports = function () {
  if (!Element.prototype.addClass) {
    Element.prototype.addClass = function (className) {
      if (this.classList) {
        this.classList.add(className);
        return this.classList;
      } else {
        this.className += ' ' + className;
        return this.className.split(' ');
      }
    };
  }

  if (!Element.prototype.hasClass) {
    Element.prototype.hasClass = function (className) {
      if (this.classList) {
        return this.classList.contains(className);
      } else {
        return new RegExp('(^| )' +
                          className +
                          '( |$)', 'gi'
                         ).test(this.className);
      }
    };
  }

  if (!Element.prototype.removeClass) {
    Element.prototype.removeClass = function (className) {
      if (this.classList) {
        this.classList.remove(className);
        return this.classList;
      } else {
        this.className = this.className.replace(
          new RegExp('(^|\\b)' +
                     className.split(' ').join('|') +
                     '(\\b|$)', 'gi'
                    ),
          ' ');
        return this.className.split(' ');
      }
    };
  }
};

},{}],2:[function(require,module,exports){
var Pixel = require('./pixel');
var TileSurface = require('./tile_surface');

var DrawSurface = function (container, params) {
  TileSurface.call(this, container, params);

  params || (params = {});
  this.BG_TILE_SIZE = params.bgTileSize || 8;
  this.initBackground();

  this.isMouseDown = false;
  this.container.addEventListener('mousemove', this.mouseMoved.bind(this),
                                  false);
  this.container.addEventListener('mouseout', this.clearHighlight.bind(this),
                                  false);
  this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                  false);
  this.container.addEventListener('mouseup', this.setMouseUp.bind(this),
                                  false);
};

DrawSurface.prototype = Object.create(TileSurface.prototype);
DrawSurface.prototype.constructor = TileSurface;

DrawSurface.prototype.initCanvas = function () {
  this.bgCanvas = document.createElement('canvas');
  this.bgCanvas.setAttribute('width', this.WIDTH);
  this.bgCanvas.setAttribute('height', this.HEIGHT);
  this.bgCanvas.addClass('draw');
  this.container.appendChild(this.bgCanvas);

  this.drawCanvas = document.createElement('canvas');
  this.drawCanvas.setAttribute('width', this.WIDTH);
  this.drawCanvas.setAttribute('height', this.HEIGHT);
  this.drawCanvas.addClass('draw');
  this.container.appendChild(this.drawCanvas);

  this.overlayCanvas = document.createElement('canvas');
  this.overlayCanvas.setAttribute('width', this.WIDTH);
  this.overlayCanvas.setAttribute('height', this.HEIGHT);
  this.overlayCanvas.addClass('draw');
  this.container.appendChild(this.overlayCanvas);

  this.bgCtx = this.bgCanvas.getContext('2d');
  this.drawCtx = this.drawCanvas.getContext('2d');
  this.overlayCtx = this.overlayCanvas.getContext('2d');
};

DrawSurface.prototype.initBackground = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

  for (var i = 0; i < NUM_TILES_HORIZ; i++) {
    for (var j = 0; j < NUM_TILES_VERT; j++) {
      var x = i * this.BG_TILE_SIZE;
      var y = j * this.BG_TILE_SIZE;

      var fill = ((i + j) % 2 == 0) ? "#999" : "#777";

      this.bgCtx.fillStyle = fill;
      this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
    }
  }
};

DrawSurface.prototype.initTiles = function () {
  var NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
  this.grid = [];

  for (var x = 0; x < NUM_PIXELS_HORIZ; x++) {
    this.grid[x] = [];

    for (var y = 0; y < NUM_PIXELS_VERT; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};


DrawSurface.prototype.mouseMoved = function (ev) {
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var NUM_PIXELS = this.grid.length;

  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x * this.TILE_SIZE;
    var fillY = currentPixel.y * this.TILE_SIZE;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
    currentPixel.highlighted = true;
  }

  this.clearHighlight(null, currentPixel);

  if (this.isMouseDown) {
    this.paintPixel(ev);
  }
};

DrawSurface.prototype.clearHighlight = function (ev, currentPixel) {
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
};

DrawSurface.prototype.paintPixel = function(ev) {
  this.isMouseDown = true;
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;

  var color = "#000000";
  var pixel = this.grid[x][y];

  var fillX = x * this.TILE_SIZE;
  var fillY = y * this.TILE_SIZE;
  this.drawCtx.fillStyle = color;
  this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
  pixel.color = color;
};

DrawSurface.prototype.setMouseUp = function () {
  this.isMouseDown = false;
};

exports = module.exports = DrawSurface;

},{"./pixel":4,"./tile_surface":5}],3:[function(require,module,exports){
var FileHandler = function (el) {
  this.el = el;
  this.el.onchange = this.fileLoaded.bind(this);
}

FileHandler.prototype.fileLoaded = function (ev) {
  var file = this.el.files[0];
  var reader = new FileReader();

  reader.onload = this.onload || null;
  reader.readAsText(file);
};

exports = module.exports = FileHandler;

},{}],4:[function(require,module,exports){
var Pixel = function (x, y) {
  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

exports = module.exports = Pixel;

},{}],5:[function(require,module,exports){
var Pixel = require('./pixel');

var TileSurface = function (container, params) {
  params || (params = {});
  this.container = container;
  if (!this.container) {
    throw {
      name: "TileSurfaceException",
      message: "TileSurface requires a container parameter.",
      toString: function () { return this.name + ": " + this.message; }
    };
  }

  this.WIDTH = params.width || 512;
  this.HEIGHT = params.height || 512;
  this.TILE_SIZE = params.tileSize || 32;

  this.initCanvas();
  this.initBackground();
  this.initTiles();
};

TileSurface.prototype.initCanvas = function () {
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('width', this.WIDTH);
  this.canvas.setAttribute('height', this.HEIGHT);

  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
};

TileSurface.prototype.initBackground = function () {
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

TileSurface.prototype.initTiles = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.TILE_SIZE;
  this.grid = [];

  for (var x = 0; x < NUM_TILES_HORIZ; x++) {
    this.grid[x] = [];

    for (var y = 0; y < NUM_TILES_VERT; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};

TileSurface.prototype.getTileCoordinates = function (ev) {
  var elRect = ev.target.getBoundingClientRect();
  var absX = ev.clientX;
  var absY = ev.clientY;
  var x = absX - elRect.left;
  var y = absY - elRect.top;

  var tileX = Math.floor(x / this.TILE_SIZE);
  var tileY = Math.floor(y / this.TILE_SIZE);

  return { x: tileX, y: tileY };
};

exports = module.exports = TileSurface;

},{"./pixel":4}],6:[function(require,module,exports){
var TMX = function (text) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, "text/xml");
  this.tree = {};

  var mapNode = doc.children[0];
  this.tree.map = TMX.objectFromAttributes(mapNode, [
    'width', 'height', 'tilewidth', 'tileheight'
  ]);

  var tilesetNodes = TMX.findChildrenByName(mapNode, 'tileset');
  this.tree.map.tilesets = [];
  for (var i = 0; i < tilesetNodes.length; i++) {
    var tilesetNode = tilesetNodes[i];
    this.tree.map.tilesets.push(
      TMX.objectFromAttributes(tilesetNode, [
        'firstgid', 'name', 'tilewidth', 'tileheight', 'spacing', 'margin'
      ])
    );
  }

  var layerNodes = TMX.findChildrenByName(mapNode, 'layer');
  this.tree.map.layers = [];
  for (i = 0; i < layerNodes.length; i++) {
    var layerNode = layerNodes[i];
    var layer = {
      data: []
    };

    var dataNodes = TMX.findChildrenByName(layerNode, 'data');
    for (var j = 0; j < dataNodes.length; j++) {
      var dataNode = dataNodes[j];
      for (var k = 0; k < dataNode.childElementCount; k++) {
        var tileNode = dataNode.children[k];
        var tile = TMX.objectFromAttributes(tileNode, ['gid']);
        layer.data.push(tile);
      }
    }

    this.tree.map.layers.push(layer);
  }
};

TMX.objectFromAttributes = function (node, attrs) {
  var obj = {};

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    obj[attr] = node.getAttribute(attr);
  }

  return obj;
};

TMX.findChildrenByName = function (node, name) {
  var children = [];
  for (var i = 0; i < node.childElementCount; i++) {
    var child = node.children[i];

    if (child.nodeName === name) {
      children.push(child);
    }
  }

  return children;
}
exports = module.exports = TMX;

},{}],7:[function(require,module,exports){
var addCustomMethods = require('./custom_methods');
var FileHandler = require('./file_handler');
var DrawSurface = require('./draw_surface');
var TMX = require('./tmx');

document.addEventListener('DOMContentLoaded', function () {
  addCustomMethods();
  var drawSurface = new DrawSurface(document.getElementById('render'));
  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    var tmx = new TMX(this.result);
    window.tmx = tmx;
  };
});

},{"./custom_methods":1,"./draw_surface":2,"./file_handler":3,"./tmx":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvY3VzdG9tX21ldGhvZHMuanMiLCJwdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwicHVibGljL2pzL2ZpbGVfaGFuZGxlci5qcyIsInB1YmxpYy9qcy9waXhlbC5qcyIsInB1YmxpYy9qcy90aWxlX3N1cmZhY2UuanMiLCJwdWJsaWMvanMvdG14LmpzIiwicHVibGljL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIUVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzKSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBpZiAodGhpcy5jbGFzc0xpc3QpIHtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICghRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MpIHtcbiAgICBFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGlmICh0aGlzLmNsYXNzTGlzdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnwgKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnKCB8JCknLCAnZ2knXG4gICAgICAgICAgICAgICAgICAgICAgICAgKS50ZXN0KHRoaXMuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgaWYgKCFFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVDbGFzcykge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0KSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgK1xuICAgICAgICAgICAgICAgICAgICAgJyhcXFxcYnwkKScsICdnaSdcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAnICcpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIiwidmFyIFBpeGVsID0gcmVxdWlyZSgnLi9waXhlbCcpO1xudmFyIFRpbGVTdXJmYWNlID0gcmVxdWlyZSgnLi90aWxlX3N1cmZhY2UnKTtcblxudmFyIERyYXdTdXJmYWNlID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgcGFyYW1zKSB7XG4gIFRpbGVTdXJmYWNlLmNhbGwodGhpcywgY29udGFpbmVyLCBwYXJhbXMpO1xuXG4gIHBhcmFtcyB8fCAocGFyYW1zID0ge30pO1xuICB0aGlzLkJHX1RJTEVfU0laRSA9IHBhcmFtcy5iZ1RpbGVTaXplIHx8IDg7XG4gIHRoaXMuaW5pdEJhY2tncm91bmQoKTtcblxuICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmNsZWFySGlnaGxpZ2h0LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnBhaW50UGl4ZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG4gIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnNldE1vdXNlVXAuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRpbGVTdXJmYWNlLnByb3RvdHlwZSk7XG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaWxlU3VyZmFjZTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmluaXRDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYmdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMuYmdDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLkhFSUdIVCk7XG4gIHRoaXMuYmdDYW52YXMuYWRkQ2xhc3MoJ2RyYXcnKTtcbiAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iZ0NhbnZhcyk7XG5cbiAgdGhpcy5kcmF3Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgdGhpcy5kcmF3Q2FudmFzLmFkZENsYXNzKCdkcmF3Jyk7XG4gIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZHJhd0NhbnZhcyk7XG5cbiAgdGhpcy5vdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgdGhpcy5vdmVybGF5Q2FudmFzLmFkZENsYXNzKCdkcmF3Jyk7XG4gIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheUNhbnZhcyk7XG5cbiAgdGhpcy5iZ0N0eCA9IHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgdGhpcy5kcmF3Q3R4ID0gdGhpcy5kcmF3Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIHRoaXMub3ZlcmxheUN0eCA9IHRoaXMub3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmluaXRCYWNrZ3JvdW5kID0gZnVuY3Rpb24gKCkge1xuICB2YXIgTlVNX1RJTEVTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuQkdfVElMRV9TSVpFO1xuICB2YXIgTlVNX1RJTEVTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuQkdfVElMRV9TSVpFO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTlVNX1RJTEVTX0hPUklaOyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IE5VTV9USUxFU19WRVJUOyBqKyspIHtcbiAgICAgIHZhciB4ID0gaSAqIHRoaXMuQkdfVElMRV9TSVpFO1xuICAgICAgdmFyIHkgPSBqICogdGhpcy5CR19USUxFX1NJWkU7XG5cbiAgICAgIHZhciBmaWxsID0gKChpICsgaikgJSAyID09IDApID8gXCIjOTk5XCIgOiBcIiM3NzdcIjtcblxuICAgICAgdGhpcy5iZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgdGhpcy5iZ0N0eC5maWxsUmVjdCh4LCB5LCB0aGlzLkJHX1RJTEVfU0laRSwgdGhpcy5CR19USUxFX1NJWkUpO1xuICAgIH1cbiAgfVxufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmluaXRUaWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIE5VTV9QSVhFTFNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHZhciBOVU1fUElYRUxTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuVElMRV9TSVpFO1xuICB0aGlzLmdyaWQgPSBbXTtcblxuICBmb3IgKHZhciB4ID0gMDsgeCA8IE5VTV9QSVhFTFNfSE9SSVo7IHgrKykge1xuICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBOVU1fUElYRUxTX1ZFUlQ7IHkrKykge1xuICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICB9XG4gIH1cbn07XG5cblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLm1vdXNlTW92ZWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgdmFyIHggPSBjb29yZHMueDtcbiAgdmFyIHkgPSBjb29yZHMueTtcbiAgdmFyIE5VTV9QSVhFTFMgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXG4gIHZhciBjdXJyZW50UGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG4gIGlmICghY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgdmFyIGZpbGxYID0gY3VycmVudFBpeGVsLnggKiB0aGlzLlRJTEVfU0laRTtcbiAgICB2YXIgZmlsbFkgPSBjdXJyZW50UGl4ZWwueSAqIHRoaXMuVElMRV9TSVpFO1xuXG4gICAgdGhpcy5vdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCI7XG4gICAgdGhpcy5vdmVybGF5Q3R4LmZpbGxSZWN0KGZpbGxYLCBmaWxsWSwgdGhpcy5USUxFX1NJWkUsIHRoaXMuVElMRV9TSVpFKTtcbiAgICBjdXJyZW50UGl4ZWwuaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICB9XG5cbiAgdGhpcy5jbGVhckhpZ2hsaWdodChudWxsLCBjdXJyZW50UGl4ZWwpO1xuXG4gIGlmICh0aGlzLmlzTW91c2VEb3duKSB7XG4gICAgdGhpcy5wYWludFBpeGVsKGV2KTtcbiAgfVxufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmNsZWFySGlnaGxpZ2h0ID0gZnVuY3Rpb24gKGV2LCBjdXJyZW50UGl4ZWwpIHtcbiAgdmFyIE5VTV9QSVhFTFNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHZhciBOVU1fUElYRUxTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuVElMRV9TSVpFO1xuICBmb3IgKHZhciBpeCA9IDA7IGl4IDwgTlVNX1BJWEVMU19IT1JJWjsgaXgrKykge1xuICAgIGZvciAodmFyIGl5ID0gMDsgaXkgPCBOVU1fUElYRUxTX1ZFUlQ7IGl5KyspIHtcbiAgICAgIHZhciBwaXhlbCA9IHRoaXMuZ3JpZFtpeF1baXldO1xuICAgICAgaWYgKHBpeGVsID09PSBjdXJyZW50UGl4ZWwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgICB2YXIgY2xyWCA9IHBpeGVsLnggKiB0aGlzLlRJTEVfU0laRTtcbiAgICAgICAgdmFyIGNsclkgPSBwaXhlbC55ICogdGhpcy5USUxFX1NJWkU7XG5cbiAgICAgICAgdGhpcy5vdmVybGF5Q3R4LmNsZWFyUmVjdChjbHJYLCBjbHJZLCB0aGlzLlRJTEVfU0laRSwgdGhpcy5USUxFX1NJWkUpO1xuICAgICAgICBwaXhlbC5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLnBhaW50UGl4ZWwgPSBmdW5jdGlvbihldikge1xuICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgdmFyIHggPSBjb29yZHMueDtcbiAgdmFyIHkgPSBjb29yZHMueTtcblxuICB2YXIgY29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgdmFyIHBpeGVsID0gdGhpcy5ncmlkW3hdW3ldO1xuXG4gIHZhciBmaWxsWCA9IHggKiB0aGlzLlRJTEVfU0laRTtcbiAgdmFyIGZpbGxZID0geSAqIHRoaXMuVElMRV9TSVpFO1xuICB0aGlzLmRyYXdDdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIHRoaXMuZHJhd0N0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIHRoaXMuVElMRV9TSVpFLCB0aGlzLlRJTEVfU0laRSk7XG4gIHBpeGVsLmNvbG9yID0gY29sb3I7XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuc2V0TW91c2VVcCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRHJhd1N1cmZhY2U7XG4iLCJ2YXIgRmlsZUhhbmRsZXIgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLmVsLm9uY2hhbmdlID0gdGhpcy5maWxlTG9hZGVkLmJpbmQodGhpcyk7XG59XG5cbkZpbGVIYW5kbGVyLnByb3RvdHlwZS5maWxlTG9hZGVkID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciBmaWxlID0gdGhpcy5lbC5maWxlc1swXTtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgcmVhZGVyLm9ubG9hZCA9IHRoaXMub25sb2FkIHx8IG51bGw7XG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRmlsZUhhbmRsZXI7XG4iLCJ2YXIgUGl4ZWwgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gIHRoaXMuY29sb3IgPSBudWxsO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUGl4ZWw7XG4iLCJ2YXIgUGl4ZWwgPSByZXF1aXJlKCcuL3BpeGVsJyk7XG5cbnZhciBUaWxlU3VyZmFjZSA9IGZ1bmN0aW9uIChjb250YWluZXIsIHBhcmFtcykge1xuICBwYXJhbXMgfHwgKHBhcmFtcyA9IHt9KTtcbiAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIGlmICghdGhpcy5jb250YWluZXIpIHtcbiAgICB0aHJvdyB7XG4gICAgICBuYW1lOiBcIlRpbGVTdXJmYWNlRXhjZXB0aW9uXCIsXG4gICAgICBtZXNzYWdlOiBcIlRpbGVTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIixcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2U7IH1cbiAgICB9O1xuICB9XG5cbiAgdGhpcy5XSURUSCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gIHRoaXMuVElMRV9TSVpFID0gcGFyYW1zLnRpbGVTaXplIHx8IDMyO1xuXG4gIHRoaXMuaW5pdENhbnZhcygpO1xuICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG4gIHRoaXMuaW5pdFRpbGVzKCk7XG59O1xuXG5UaWxlU3VyZmFjZS5wcm90b3R5cGUuaW5pdENhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcblxuICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5pbml0QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDAwMDAwXCI7XG4gIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuV0lEVEgsIHRoaXMuSEVJR0hUKTtcbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5pbml0VGlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBOVU1fVElMRVNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHZhciBOVU1fVElMRVNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gIHRoaXMuZ3JpZCA9IFtdO1xuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgTlVNX1RJTEVTX0hPUklaOyB4KyspIHtcbiAgICB0aGlzLmdyaWRbeF0gPSBbXTtcblxuICAgIGZvciAodmFyIHkgPSAwOyB5IDwgTlVNX1RJTEVTX1ZFUlQ7IHkrKykge1xuICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICB9XG4gIH1cbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5nZXRUaWxlQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGVsUmVjdCA9IGV2LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIGFic1ggPSBldi5jbGllbnRYO1xuICB2YXIgYWJzWSA9IGV2LmNsaWVudFk7XG4gIHZhciB4ID0gYWJzWCAtIGVsUmVjdC5sZWZ0O1xuICB2YXIgeSA9IGFic1kgLSBlbFJlY3QudG9wO1xuXG4gIHZhciB0aWxlWCA9IE1hdGguZmxvb3IoeCAvIHRoaXMuVElMRV9TSVpFKTtcbiAgdmFyIHRpbGVZID0gTWF0aC5mbG9vcih5IC8gdGhpcy5USUxFX1NJWkUpO1xuXG4gIHJldHVybiB7IHg6IHRpbGVYLCB5OiB0aWxlWSB9O1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVGlsZVN1cmZhY2U7XG4iLCJ2YXIgVE1YID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L3htbFwiKTtcbiAgdGhpcy50cmVlID0ge307XG5cbiAgdmFyIG1hcE5vZGUgPSBkb2MuY2hpbGRyZW5bMF07XG4gIHRoaXMudHJlZS5tYXAgPSBUTVgub2JqZWN0RnJvbUF0dHJpYnV0ZXMobWFwTm9kZSwgW1xuICAgICd3aWR0aCcsICdoZWlnaHQnLCAndGlsZXdpZHRoJywgJ3RpbGVoZWlnaHQnXG4gIF0pO1xuXG4gIHZhciB0aWxlc2V0Tm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKG1hcE5vZGUsICd0aWxlc2V0Jyk7XG4gIHRoaXMudHJlZS5tYXAudGlsZXNldHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aWxlc2V0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGlsZXNldE5vZGUgPSB0aWxlc2V0Tm9kZXNbaV07XG4gICAgdGhpcy50cmVlLm1hcC50aWxlc2V0cy5wdXNoKFxuICAgICAgVE1YLm9iamVjdEZyb21BdHRyaWJ1dGVzKHRpbGVzZXROb2RlLCBbXG4gICAgICAgICdmaXJzdGdpZCcsICduYW1lJywgJ3RpbGV3aWR0aCcsICd0aWxlaGVpZ2h0JywgJ3NwYWNpbmcnLCAnbWFyZ2luJ1xuICAgICAgXSlcbiAgICApO1xuICB9XG5cbiAgdmFyIGxheWVyTm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKG1hcE5vZGUsICdsYXllcicpO1xuICB0aGlzLnRyZWUubWFwLmxheWVycyA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgbGF5ZXJOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsYXllck5vZGUgPSBsYXllck5vZGVzW2ldO1xuICAgIHZhciBsYXllciA9IHtcbiAgICAgIGRhdGE6IFtdXG4gICAgfTtcblxuICAgIHZhciBkYXRhTm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKGxheWVyTm9kZSwgJ2RhdGEnKTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGFOb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGRhdGFOb2RlID0gZGF0YU5vZGVzW2pdO1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBkYXRhTm9kZS5jaGlsZEVsZW1lbnRDb3VudDsgaysrKSB7XG4gICAgICAgIHZhciB0aWxlTm9kZSA9IGRhdGFOb2RlLmNoaWxkcmVuW2tdO1xuICAgICAgICB2YXIgdGlsZSA9IFRNWC5vYmplY3RGcm9tQXR0cmlidXRlcyh0aWxlTm9kZSwgWydnaWQnXSk7XG4gICAgICAgIGxheWVyLmRhdGEucHVzaCh0aWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRyZWUubWFwLmxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxufTtcblxuVE1YLm9iamVjdEZyb21BdHRyaWJ1dGVzID0gZnVuY3Rpb24gKG5vZGUsIGF0dHJzKSB7XG4gIHZhciBvYmogPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcbiAgICBvYmpbYXR0cl0gPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5UTVguZmluZENoaWxkcmVuQnlOYW1lID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUpIHtcbiAgdmFyIGNoaWxkcmVuID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZEVsZW1lbnRDb3VudDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gbmFtZSkge1xuICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVE1YO1xuIiwidmFyIGFkZEN1c3RvbU1ldGhvZHMgPSByZXF1aXJlKCcuL2N1c3RvbV9tZXRob2RzJyk7XG52YXIgRmlsZUhhbmRsZXIgPSByZXF1aXJlKCcuL2ZpbGVfaGFuZGxlcicpO1xudmFyIERyYXdTdXJmYWNlID0gcmVxdWlyZSgnLi9kcmF3X3N1cmZhY2UnKTtcbnZhciBUTVggPSByZXF1aXJlKCcuL3RteCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBhZGRDdXN0b21NZXRob2RzKCk7XG4gIHZhciBkcmF3U3VyZmFjZSA9IG5ldyBEcmF3U3VyZmFjZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyJykpO1xuICB2YXIgdG14RmlsZUhhbmRsZXIgPSBuZXcgRmlsZUhhbmRsZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RteC1maWxlJykpO1xuXG4gIHRteEZpbGVIYW5kbGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG14ID0gbmV3IFRNWCh0aGlzLnJlc3VsdCk7XG4gICAgd2luZG93LnRteCA9IHRteDtcbiAgfTtcbn0pO1xuIl19
