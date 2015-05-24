var addCustomMethods = require('./custom_methods');
var DrawSurface = require('./draw_surface');
var TMX = require('./tmx');

document.addEventListener('DOMContentLoaded', function () {
  addCustomMethods();
  var drawSurface = new DrawSurface(document.getElementById('render'));
});
