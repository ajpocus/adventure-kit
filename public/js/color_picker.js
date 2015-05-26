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
      <div class="color-picker">
        <input type="color" id="flat-color" className="color"/>
        <input type="color" id="primary-color" className="color"/>
        <input type="color" id="secondary-color" className="color"/>
      </div>
    );
  },

  componentDidMount: function () {
    // Set up spectrum -- with Browserify it's rather borked.
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
