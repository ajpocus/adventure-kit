let React = require('react');
let $ = require('jquery');
let Spectrum = require('../lib/spectrum');
let assign = require('object-assign');

let ColorPicker = React.createClass({
  render: function () {
    return (
      <div className="color-picker">
        <input type="color" id="primary-color" className="color"/>
        <input type="color" id="secondary-color" className="color"/>

        <div id="primary-container"></div>
        <div id="secondary-container"></div>
      </div>
    );
  },

  componentDidMount: function () {
    // Set up spectrum -- with Browserify it's rather borked.
    Spectrum($);

    let baseParams = {
      showInput: true,
      showPalette: true,
      palette: [],
      preferredFormat: 'hex',
      showButtons: false,
    };

    let primaryParams = assign(baseParams, {
      color: this.props.primaryColor,
      replacerClassName: 'primary',
      change: this.handlePrimaryColorChange,
      appendTo: $('#primary-container')
    });

    $("#primary-color").spectrum(primaryParams);

    let secondaryParams = assign(baseParams, {
      color: this.props.secondaryColor,
      replacerClassName: 'secondary',
      change: this.handleSecondaryColorChange,
      appendTo: $('#secondary-container')
    });

    $("#secondary-color").spectrum(secondaryParams);
  },

  componentDidUpdate: function () {
    console.log('setting colorpicker to ' + this.props.primaryColor);
    $("#primary-color").spectrum('set', this.props.primaryColor);
    $("#secondary-color").spectrum('set', this.props.secondaryColor);
  },

  handlePrimaryColorChange: function (color) {
    this.props.onPrimaryColorChange(color);
  },

  handleSecondaryColorChange: function (color) {
    this.props.onSecondaryColorChange(color);
  }
});

export default ColorPicker;
