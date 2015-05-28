let React = require('react');
let $ = require('jquery');
let Spectrum = require('../lib/spectrum');

let ColorPicker = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: "#000000",
      secondaryColor: "rgba(0, 0, 0, 0)"
    };
  },

  render: function () {
    return (
      <div className="color-picker">
        <input type="color" id="primary-color" className="color"/>
        <input type="color" id="secondary-color" className="color"/>
      </div>
    );
  },

  componentDidMount: function () {
    var component = this;

    // Set up spectrum -- with Browserify it's rather borked.
    Spectrum($);

    $("#primary-color").spectrum({
      showInput: true,
      showPalette: true,
      palette: ["#000", "rgba(0, 0, 0, 0)", "#00f"],
      preferredFormat: 'hex',
      color: '#000000',
      replacerClassName: 'primary',
      change: component.handlePrimaryColorChange
    });

    $("#secondary-color").spectrum({
      showInput: true,
      showPalette: true,
      palette: ["#000", "rgba(0, 0, 0, 0)", "#fff"],
      preferredFormat: 'hex',
      color: 'rgba(0, 0, 0, 0)',
      replacerClassName: 'secondary',
      change: component.handleSecondaryColorChange
    });
  },

  handlePrimaryColorChange: function (color) {
    this.props.onPrimaryColorChange(color);
  },

  handleSecondaryColorChange: function (color) {
    this.props.onSecondaryColorChange(color);
  }
});

export default ColorPicker;
