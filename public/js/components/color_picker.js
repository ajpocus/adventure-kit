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
  }
});

export default ColorPicker;