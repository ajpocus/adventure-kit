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
