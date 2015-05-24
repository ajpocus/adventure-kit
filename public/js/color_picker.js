var $ = require('jquery');
var Spectrum = require('./lib/spectrum');

var ColorPicker = function () {
  this.primaryColor = "#000000";
  this.secondaryColor = "rgba(0, 0, 0, 0)";

  // Set up spectrum, as defined in a CommonJS environment. It's rather fucked.
  Spectrum($);

  $("#primary-color").spectrum({
    showInput: true,
    flat: true,
    preferredFormat: 'hex',
    replacerClassName: 'color-replacer'
  });

  $("#secondary-color").spectrum({
    showInput: true,
    preferredFormat: 'hex',
    replacerClassName: 'color-replacer'
  });
};

exports = module.exports = ColorPicker;
