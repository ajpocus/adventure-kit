var $ = require('jquery');
var Spectrum = require('./lib/spectrum');

var ColorPicker = function () {
  this.primaryColor = "#000000";
  this.secondaryColor = "rgba(0, 0, 0, 0)";

  // Set up spectrum, as defined in a CommonJS environment. It's rather fucked.
  Spectrum($);

  $("#primary-color").spectrum({
    showInput: true,
    preferredFormat: 'hex',
    flat: true
  });

  $("#secondary-color").spectrum({
    showInput: true,
    preferredFormat: 'hex'
  });
};

exports = module.exports = ColorPicker;
