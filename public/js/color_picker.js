var $ = require('jquery');
var Spectrum = require('./lib/spectrum');

var ColorPicker = function () {
  this.primaryColor = "#000000";
  this.secondaryColor = "rgba(0, 0, 0, 0)";

  // Set up spectrum, as defined in a CommonJS environment. It's rather fucked.
  Spectrum($);

  $("#flat-color").spectrum({
    showInput: true,
    flat: true,
    preferredFormat: 'hex',
    color: '#000000',
    move: this.setPrimary
  });

  $("#primary-color").spectrum({
    showInput: true,
    preferredFormat: 'hex',
    color: '#000000',
    change: this.setFlat,
    click: null
  });

  $("#secondary-color").spectrum({
    showInput: true,
    preferredFormat: 'hex',
    color: 'rgba(0, 0, 0, 0)'
  });
};

ColorPicker.prototype.setPrimary = function (color) {
  color = color.toHexString();
  $("#primary-color").spectrum('set', color);
  this.primaryColor = color;
};

ColorPicker.prototype.setFlat = function (color) {
  color = color.toHexString();
  $("#flat-color").spectrum('set', color);
};

exports = module.exports = ColorPicker;
