require('babel/polyfill');
let _ = require('underscore');
let Backbone = require('backbone');

import addCustomMethods from './custom_methods';
import DrawSurface from'./draw_surface';

document.addEventListener('DOMContentLoaded', function () {
  addCustomMethods();
  let drawSurface = new DrawSurface(document.getElementById('render'));
});
