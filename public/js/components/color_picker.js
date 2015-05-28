let React = require('react');
let $ = require('jquery');
let Spectrum = require('../lib/spectrum');
let assign = require('object-assign');

let ColorPicker = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: "#000",
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
    // Set up spectrum -- with Browserify it's rather borked.
    Spectrum($);

    let baseParams = {
      showInput: true,
      showPalette: true,
      palette: ["#000", "rgba(0, 0, 0, 0)"],
      preferredFormat: 'hex',
      showButtons: false
    };

    let primaryParams = assign(baseParams, {
      color: "#000",
      replacerClassName: 'primary',
      change: this.handlePrimaryColorChange
    });

    $("#primary-color").spectrum(primaryParams);

    let secondaryParams = assign(baseParams, {
      color: "rgba(0, 0, 0, 0)",
      replacerClassName: 'secondary',
      change: this.handleSecondaryColorChange
    });

    $("#secondary-color").spectrum(secondaryParams);
  },

  handlePrimaryColorChange: function (color) {
    this.props.onPrimaryColorChange(color);
  },

  handleSecondaryColorChange: function (color) {
    this.props.onSecondaryColorChange(color);
  }
});

export default ColorPicker;
