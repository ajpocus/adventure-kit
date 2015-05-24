var $ = require('jquery');

var ColorPicker = function () {
  this.currentColor = "#000000";
  this.secondaryColor = "rgba(0, 0, 0, 0)";

  $("#primary-color").spectrum({
    showInput: true
  })
};

exports = module.exports = ColorPicker;
