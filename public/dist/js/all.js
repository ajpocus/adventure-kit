(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

document.addEventListener('DOMContentLoaded', function () {
  var bgCanvas = document.getElementById('bg-canvas');
  var drawCanvas = document.getElementById('draw-canvas');
  var overlayCanvas = document.getElementById('overlay-canvas');

  var bgCtx = bgCanvas.getContext('2d');
  var drawCtx = drawCanvas.getContext('2d');
  var overlayCtx = overlayCanvas.getContext('2d');

  var WIDTH = bgCanvas.width;
  var HEIGHT = bgCanvas.height;
  var BG_TILE_SIZE = 8;
  var PIXEL_SIZE = 32;

  function highlightPixel(ev) {
    console.log('HIGHLIGHT');

    var _getPixelCoordinates = getPixelCoordinates(ev);

    var _getPixelCoordinates2 = _slicedToArray(_getPixelCoordinates, 2);

    var x = _getPixelCoordinates2[0];
    var y = _getPixelCoordinates2[1];

    var NUM_PIXELS = PixelGrid.length;

    // highlight the pixel under the mouse
    var currentPixel = PixelGrid[x][y];
    if (!currentPixel.highlighted) {
      var fillX = currentPixel.x * PIXEL_SIZE;
      var fillY = currentPixel.y * PIXEL_SIZE;

      overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      overlayCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
      currentPixel.highlighted = true;
    }

    // clear highlighting on other pixels
    var NUM_PIXELS_HORIZ = WIDTH / PIXEL_SIZE;
    var NUM_PIXELS_VERT = HEIGHT / PIXEL_SIZE;
    for (var ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
      for (var iy = 0; iy < NUM_PIXELS_VERT; iy++) {
        var pixel = PixelGrid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          var fillX = pixel.x * PIXEL_SIZE;
          var fillY = pixel.y * PIXEL_SIZE;

          overlayCtx.clearRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  }

  function paintPixel(ev) {
    console.log('PAINT');

    var _getPixelCoordinates3 = getPixelCoordinates(ev);

    var _getPixelCoordinates32 = _slicedToArray(_getPixelCoordinates3, 2);

    var x = _getPixelCoordinates32[0];
    var y = _getPixelCoordinates32[1];

    var color = '#000000';
    var pixel = PixelGrid[x][y];

    var fillX = x * PIXEL_SIZE;
    var fillY = y * PIXEL_SIZE;
    drawCtx.fillStyle = color;
    drawCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
    pixel.color = color;
  }

  drawBackground();
  initializeDrawSurface();
  overlayCanvas.addEventListener('mousemove', highlightPixel, false);
  overlayCanvas.addEventListener('mousedown', paintPixel, false);
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvYWR2ZW50dXJlLWtpdC9wdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7O0FBRWIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVk7QUFDeEQsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwRCxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELE1BQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFOUQsTUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxNQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLE1BQUksVUFBVSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDN0IsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQixNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUV0QixXQUFTLGNBQWMsQ0FBRSxFQUFFLEVBQUU7QUFDM0IsV0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7K0JBQ1osbUJBQW1CLENBQUMsRUFBRSxDQUFDOzs7O1FBQS9CLENBQUM7UUFBRSxDQUFDOztBQUNULFFBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7OztBQUdwQyxRQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7QUFDN0IsVUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDeEMsVUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRXhDLGdCQUFVLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDO0FBQ2xELGdCQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzFELGtCQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztLQUNqQzs7O0FBR0QsUUFBSSxnQkFBZ0IsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFDO0FBQzFDLFFBQUksZUFBZSxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDMUMsU0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzVDLFdBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxlQUFlLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDM0MsWUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLFlBQUksS0FBSyxLQUFLLFlBQVksRUFBRTtBQUMxQixtQkFBUztTQUNWOztBQUVELFlBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUNyQixjQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUNqQyxjQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQzs7QUFFakMsb0JBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDM0QsZUFBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDM0I7T0FDRjtLQUNGO0dBQ0Y7O0FBRUQsV0FBUyxVQUFVLENBQUUsRUFBRSxFQUFFO0FBQ3ZCLFdBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O2dDQUNSLG1CQUFtQixDQUFDLEVBQUUsQ0FBQzs7OztRQUEvQixDQUFDO1FBQUUsQ0FBQzs7QUFDVCxRQUFJLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDdEIsUUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU1QixRQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQzNCLFFBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDM0IsV0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDMUIsV0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxTQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNyQjs7QUFFRCxnQkFBYyxFQUFFLENBQUM7QUFDakIsdUJBQXFCLEVBQUUsQ0FBQztBQUN4QixlQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRSxlQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztDQUNoRSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBsZXQgYmdDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmctY2FudmFzJyk7XG4gIGxldCBkcmF3Q2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYXctY2FudmFzJyk7XG4gIGxldCBvdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktY2FudmFzJyk7XG5cbiAgbGV0IGJnQ3R4ID0gYmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgbGV0IGRyYXdDdHggPSBkcmF3Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGxldCBvdmVybGF5Q3R4ID0gb3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIGNvbnN0IFdJRFRIID0gYmdDYW52YXMud2lkdGg7XG4gIGNvbnN0IEhFSUdIVCA9IGJnQ2FudmFzLmhlaWdodDtcbiAgY29uc3QgQkdfVElMRV9TSVpFID0gODtcbiAgY29uc3QgUElYRUxfU0laRSA9IDMyO1xuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodFBpeGVsIChldikge1xuICAgIGNvbnNvbGUubG9nKFwiSElHSExJR0hUXCIpO1xuICAgIGxldCBbeCwgeV0gPSBnZXRQaXhlbENvb3JkaW5hdGVzKGV2KTtcbiAgICBjb25zdCBOVU1fUElYRUxTID0gUGl4ZWxHcmlkLmxlbmd0aDtcblxuICAgIC8vIGhpZ2hsaWdodCB0aGUgcGl4ZWwgdW5kZXIgdGhlIG1vdXNlXG4gICAgbGV0IGN1cnJlbnRQaXhlbCA9IFBpeGVsR3JpZFt4XVt5XTtcbiAgICBpZiAoIWN1cnJlbnRQaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgbGV0IGZpbGxYID0gY3VycmVudFBpeGVsLnggKiBQSVhFTF9TSVpFO1xuICAgICAgbGV0IGZpbGxZID0gY3VycmVudFBpeGVsLnkgKiBQSVhFTF9TSVpFO1xuXG4gICAgICBvdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCI7XG4gICAgICBvdmVybGF5Q3R4LmZpbGxSZWN0KGZpbGxYLCBmaWxsWSwgUElYRUxfU0laRSwgUElYRUxfU0laRSk7XG4gICAgICBjdXJyZW50UGl4ZWwuaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIGhpZ2hsaWdodGluZyBvbiBvdGhlciBwaXhlbHNcbiAgICBsZXQgTlVNX1BJWEVMU19IT1JJWiA9IFdJRFRIIC8gUElYRUxfU0laRTtcbiAgICBsZXQgTlVNX1BJWEVMU19WRVJUID0gSEVJR0hUIC8gUElYRUxfU0laRTtcbiAgICBmb3IgKGxldCBpeCA9IDA7IGl4IDwgTlVNX1BJWEVMU19IT1JJWjsgaXgrKykge1xuICAgICAgZm9yIChsZXQgaXkgPSAwOyBpeSA8IE5VTV9QSVhFTFNfVkVSVDsgaXkrKykge1xuICAgICAgICBsZXQgcGl4ZWwgPSBQaXhlbEdyaWRbaXhdW2l5XTtcbiAgICAgICAgaWYgKHBpeGVsID09PSBjdXJyZW50UGl4ZWwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwaXhlbC5oaWdobGlnaHRlZCkge1xuICAgICAgICAgIGxldCBmaWxsWCA9IHBpeGVsLnggKiBQSVhFTF9TSVpFO1xuICAgICAgICAgIGxldCBmaWxsWSA9IHBpeGVsLnkgKiBQSVhFTF9TSVpFO1xuXG4gICAgICAgICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoZmlsbFgsIGZpbGxZLCBQSVhFTF9TSVpFLCBQSVhFTF9TSVpFKTtcbiAgICAgICAgICBwaXhlbC5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFpbnRQaXhlbCAoZXYpIHtcbiAgICBjb25zb2xlLmxvZyhcIlBBSU5UXCIpO1xuICAgIGxldCBbeCwgeV0gPSBnZXRQaXhlbENvb3JkaW5hdGVzKGV2KTtcbiAgICBsZXQgY29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgICBsZXQgcGl4ZWwgPSBQaXhlbEdyaWRbeF1beV07XG5cbiAgICBsZXQgZmlsbFggPSB4ICogUElYRUxfU0laRTtcbiAgICBsZXQgZmlsbFkgPSB5ICogUElYRUxfU0laRTtcbiAgICBkcmF3Q3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGRyYXdDdHguZmlsbFJlY3QoZmlsbFgsIGZpbGxZLCBQSVhFTF9TSVpFLCBQSVhFTF9TSVpFKTtcbiAgICBwaXhlbC5jb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgZHJhd0JhY2tncm91bmQoKTtcbiAgaW5pdGlhbGl6ZURyYXdTdXJmYWNlKCk7XG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGlnaGxpZ2h0UGl4ZWwsIGZhbHNlKTtcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBwYWludFBpeGVsLCBmYWxzZSk7XG59KTtcbiJdfQ==
