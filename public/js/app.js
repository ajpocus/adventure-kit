var DrawSurface = require('./draw_surface');
var FileHandler = require('./file_handler');

document.addEventListener('DOMContentLoaded', function () {
  var drawContainer = document.getElementById('tile-map');
  var drawSurface = new DrawSurface(drawContainer);

  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));
});
