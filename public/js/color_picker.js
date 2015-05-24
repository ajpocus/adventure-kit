var $ = require('jquery');
var Spectrum = require('./lib/spectrum');

class ColorPicker {
  constructor () {
    this.primaryColor = "#000000";
    this.secondaryColor = "rgba(0, 0, 0, 0)";

    // Set up spectrum -- it's rather fucked.
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
  }

  setPrimary (color) {
    let colorHex = color.toHexString();
    $("#primary-color").spectrum('set', colorHex);
    this.primaryColor = colorHex;
  }

  setFlat (color) {
    let colorHex = color.toHexString();
    $("#flat-color").spectrum('set', colorHex);
    this.primaryColor = colorHex;
  }
}

export default ColorPicker;
