let React = require('react');
let $ = require('jquery');
let Spectrum = require('./lib/spectrum');

let ColorPicker = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: "#000000",
      secondaryColor: "rgba(0, 0, 0, 0)"
    };
  },

  render: function () {
    return (

    );
  },

  componentDidMount: function () {
    // Set up spectrum -- with Browserify it's rather borked.
    Spectrum($);

    $("#primary-color").spectrum({
      showInput: true,
      preferredFormat: 'hex',
      color: '#000000',
      replacerClassName: 'primary'
    });

    $("#secondary-color").spectrum({
      showInput: true,
      preferredFormat: 'hex',
      color: 'rgba(0, 0, 0, 0)',
      replacerClassName: 'secondary'
    });
  },

  setPrimary: function (color) {
    let colorHex = color.toHexString();
    $("#primary-color").spectrum('set', colorHex);
    this.primaryColor = colorHex;
  },

  setFlat: function (color) {
    let colorHex = color.toHexString();
    $("#flat-color").spectrum('set', colorHex);
    this.primaryColor = colorHex;
  }
});

export default ColorPicker;
