require('babel/polyfill');

let $ = require('jquery');

import DrawSurface from'./draw_surface';

$(function () {
  let drawSurface = new DrawSurface(document.getElementById('render'));
});
