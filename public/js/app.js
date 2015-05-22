var FileHandler = require('./file_handler');
var RenderSurface = require('./render_surface');
var TMX = require('./tmx');

document.addEventListener('DOMContentLoaded', function () {
  var renderSurface = new RenderSurface(document.getElementById('render'));
  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    var tmx = new TMX(this.result);
  };
});
