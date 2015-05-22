(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var Pixel = function (x, y) {
  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

exports = module.exports = Pixel;

},{}],3:[function(require,module,exports){
var TileSurface = require('./tile_surface');

var RenderSurface = function (container, params) {
  TileSurface.call(this, container, params);

  params || (params = {});
  this.container = container;
  if (!this.container) {
    throw new Exception("DrawSurface requires a container parameter.");
  }

  this.width = params.width || 512;
  this.height = params.height || 512;
};

RenderSurface.prototype.initBackgound = function () {
  this.ctx.fillStyle = "#aaaaaa";
  this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

RenderSurface.prototype = Object.create(TileSurface.prototype);
RenderSurface.prototype.constructor = TileSurface;


exports = module.exports = RenderSurface;

},{"./tile_surface":4}],4:[function(require,module,exports){
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

},{"./pixel":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var FileHandler = require('./file_handler');
var RenderSurface = require('./render_surface');
var TMX = require('./tmx');

document.addEventListener('DOMContentLoaded', function () {
  var renderSurface = new RenderSurface(document.getElementById('render'));
  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    var tmx = new TMX(this.result);
    window.tmx = tmx;
  };
});

},{"./file_handler":1,"./render_surface":3,"./tmx":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvZmlsZV9oYW5kbGVyLmpzIiwicHVibGljL2pzL3BpeGVsLmpzIiwicHVibGljL2pzL3JlbmRlcl9zdXJmYWNlLmpzIiwicHVibGljL2pzL3RpbGVfc3VyZmFjZS5qcyIsInB1YmxpYy9qcy90bXguanMiLCJwdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBGaWxlSGFuZGxlciA9IGZ1bmN0aW9uIChlbCkge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMuZWwub25jaGFuZ2UgPSB0aGlzLmZpbGVMb2FkZWQuYmluZCh0aGlzKTtcbn1cblxuRmlsZUhhbmRsZXIucHJvdG90eXBlLmZpbGVMb2FkZWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGZpbGUgPSB0aGlzLmVsLmZpbGVzWzBdO1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICByZWFkZXIub25sb2FkID0gdGhpcy5vbmxvYWQgfHwgbnVsbDtcbiAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBGaWxlSGFuZGxlcjtcbiIsInZhciBQaXhlbCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG4gIHRoaXMuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgdGhpcy5jb2xvciA9IG51bGw7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBQaXhlbDtcbiIsInZhciBUaWxlU3VyZmFjZSA9IHJlcXVpcmUoJy4vdGlsZV9zdXJmYWNlJyk7XG5cbnZhciBSZW5kZXJTdXJmYWNlID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgcGFyYW1zKSB7XG4gIFRpbGVTdXJmYWNlLmNhbGwodGhpcywgY29udGFpbmVyLCBwYXJhbXMpO1xuXG4gIHBhcmFtcyB8fCAocGFyYW1zID0ge30pO1xuICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgaWYgKCF0aGlzLmNvbnRhaW5lcikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJEcmF3U3VyZmFjZSByZXF1aXJlcyBhIGNvbnRhaW5lciBwYXJhbWV0ZXIuXCIpO1xuICB9XG5cbiAgdGhpcy53aWR0aCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG59O1xuXG5SZW5kZXJTdXJmYWNlLnByb3RvdHlwZS5pbml0QmFja2dvdW5kID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiNhYWFhYWFcIjtcbiAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5XSURUSCwgdGhpcy5IRUlHSFQpO1xufTtcblxuUmVuZGVyU3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRpbGVTdXJmYWNlLnByb3RvdHlwZSk7XG5SZW5kZXJTdXJmYWNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRpbGVTdXJmYWNlO1xuXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlclN1cmZhY2U7XG4iLCJ2YXIgUGl4ZWwgPSByZXF1aXJlKCcuL3BpeGVsJyk7XG5cbnZhciBUaWxlU3VyZmFjZSA9IGZ1bmN0aW9uIChjb250YWluZXIsIHBhcmFtcykge1xuICBwYXJhbXMgfHwgKHBhcmFtcyA9IHt9KTtcbiAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIGlmICghdGhpcy5jb250YWluZXIpIHtcbiAgICB0aHJvdyB7XG4gICAgICBuYW1lOiBcIlRpbGVTdXJmYWNlRXhjZXB0aW9uXCIsXG4gICAgICBtZXNzYWdlOiBcIlRpbGVTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIixcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2U7IH1cbiAgICB9O1xuICB9XG5cbiAgdGhpcy5XSURUSCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gIHRoaXMuVElMRV9TSVpFID0gcGFyYW1zLnRpbGVTaXplIHx8IDMyO1xuXG4gIHRoaXMuaW5pdENhbnZhcygpO1xuICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG4gIHRoaXMuaW5pdFRpbGVzKCk7XG59O1xuXG5UaWxlU3VyZmFjZS5wcm90b3R5cGUuaW5pdENhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcblxuICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5pbml0QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDAwMDAwXCI7XG4gIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuV0lEVEgsIHRoaXMuSEVJR0hUKTtcbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5pbml0VGlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBOVU1fVElMRVNfSE9SSVogPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHZhciBOVU1fVElMRVNfVkVSVCA9IHRoaXMuSEVJR0hUIC8gdGhpcy5USUxFX1NJWkU7XG4gIHRoaXMuZ3JpZCA9IFtdO1xuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgTlVNX1RJTEVTX0hPUklaOyB4KyspIHtcbiAgICB0aGlzLmdyaWRbeF0gPSBbXTtcblxuICAgIGZvciAodmFyIHkgPSAwOyB5IDwgTlVNX1RJTEVTX1ZFUlQ7IHkrKykge1xuICAgICAgdGhpcy5ncmlkW3hdLnB1c2gobmV3IFBpeGVsKHgsIHkpKTtcbiAgICB9XG4gIH1cbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5nZXRUaWxlQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGVsUmVjdCA9IGV2LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIGFic1ggPSBldi5jbGllbnRYO1xuICB2YXIgYWJzWSA9IGV2LmNsaWVudFk7XG4gIHZhciB4ID0gYWJzWCAtIGVsUmVjdC5sZWZ0O1xuICB2YXIgeSA9IGFic1kgLSBlbFJlY3QudG9wO1xuXG4gIHZhciB0aWxlWCA9IE1hdGguZmxvb3IoeCAvIHRoaXMuVElMRV9TSVpFKTtcbiAgdmFyIHRpbGVZID0gTWF0aC5mbG9vcih5IC8gdGhpcy5USUxFX1NJWkUpO1xuXG4gIHJldHVybiB7IHg6IHRpbGVYLCB5OiB0aWxlWSB9O1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVGlsZVN1cmZhY2U7XG4iLCJ2YXIgVE1YID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L3htbFwiKTtcbiAgdGhpcy50cmVlID0ge307XG5cbiAgdmFyIG1hcE5vZGUgPSBkb2MuY2hpbGRyZW5bMF07XG4gIHRoaXMudHJlZS5tYXAgPSBUTVgub2JqZWN0RnJvbUF0dHJpYnV0ZXMobWFwTm9kZSwgW1xuICAgICd3aWR0aCcsICdoZWlnaHQnLCAndGlsZXdpZHRoJywgJ3RpbGVoZWlnaHQnXG4gIF0pO1xuXG4gIHZhciB0aWxlc2V0Tm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKG1hcE5vZGUsICd0aWxlc2V0Jyk7XG4gIHRoaXMudHJlZS5tYXAudGlsZXNldHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aWxlc2V0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGlsZXNldE5vZGUgPSB0aWxlc2V0Tm9kZXNbaV07XG4gICAgdGhpcy50cmVlLm1hcC50aWxlc2V0cy5wdXNoKFxuICAgICAgVE1YLm9iamVjdEZyb21BdHRyaWJ1dGVzKHRpbGVzZXROb2RlLCBbXG4gICAgICAgICdmaXJzdGdpZCcsICduYW1lJywgJ3RpbGV3aWR0aCcsICd0aWxlaGVpZ2h0JywgJ3NwYWNpbmcnLCAnbWFyZ2luJ1xuICAgICAgXSlcbiAgICApO1xuICB9XG5cbiAgdmFyIGxheWVyTm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKG1hcE5vZGUsICdsYXllcicpO1xuICB0aGlzLnRyZWUubWFwLmxheWVycyA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgbGF5ZXJOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsYXllck5vZGUgPSBsYXllck5vZGVzW2ldO1xuICAgIHZhciBsYXllciA9IHtcbiAgICAgIGRhdGE6IFtdXG4gICAgfTtcblxuICAgIHZhciBkYXRhTm9kZXMgPSBUTVguZmluZENoaWxkcmVuQnlOYW1lKGxheWVyTm9kZSwgJ2RhdGEnKTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGFOb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGRhdGFOb2RlID0gZGF0YU5vZGVzW2pdO1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBkYXRhTm9kZS5jaGlsZEVsZW1lbnRDb3VudDsgaysrKSB7XG4gICAgICAgIHZhciB0aWxlTm9kZSA9IGRhdGFOb2RlLmNoaWxkcmVuW2tdO1xuICAgICAgICB2YXIgdGlsZSA9IFRNWC5vYmplY3RGcm9tQXR0cmlidXRlcyh0aWxlTm9kZSwgWydnaWQnXSk7XG4gICAgICAgIGxheWVyLmRhdGEucHVzaCh0aWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRyZWUubWFwLmxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxufTtcblxuVE1YLm9iamVjdEZyb21BdHRyaWJ1dGVzID0gZnVuY3Rpb24gKG5vZGUsIGF0dHJzKSB7XG4gIHZhciBvYmogPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcbiAgICBvYmpbYXR0cl0gPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5UTVguZmluZENoaWxkcmVuQnlOYW1lID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUpIHtcbiAgdmFyIGNoaWxkcmVuID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZEVsZW1lbnRDb3VudDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gbmFtZSkge1xuICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVE1YO1xuIiwidmFyIEZpbGVIYW5kbGVyID0gcmVxdWlyZSgnLi9maWxlX2hhbmRsZXInKTtcbnZhciBSZW5kZXJTdXJmYWNlID0gcmVxdWlyZSgnLi9yZW5kZXJfc3VyZmFjZScpO1xudmFyIFRNWCA9IHJlcXVpcmUoJy4vdG14Jyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciByZW5kZXJTdXJmYWNlID0gbmV3IFJlbmRlclN1cmZhY2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlbmRlcicpKTtcbiAgdmFyIHRteEZpbGVIYW5kbGVyID0gbmV3IEZpbGVIYW5kbGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0bXgtZmlsZScpKTtcblxuICB0bXhGaWxlSGFuZGxlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRteCA9IG5ldyBUTVgodGhpcy5yZXN1bHQpO1xuICAgIHdpbmRvdy50bXggPSB0bXg7XG4gIH07XG59KTtcbiJdfQ==
