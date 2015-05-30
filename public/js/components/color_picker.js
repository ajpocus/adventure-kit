let React = require('react');
let $ = require('jquery');
let assign = require('object-assign');
let jscolor = require('../lib/jscolor');

let ColorPicker = React.createClass({
  render: function () {
    return (
      <div className="color-picker">
        <input id="primary-color"/>
        <input id="secondary-color"/>
      </div>
    );
  },

  componentDidMount: function () {
    let primaryColor = document.getElementById('primary-color');
    let secondaryColor = document.getElementById('secondary-color');
    let primaryPicker = new jscolor.color(primaryColor, {
      hash: true
    });
    let secondaryPicker = new jscolor.color(secondaryColor, {
      hash: true
    });
  },

  componentDidUpdate: function () {
    console.log(this.props.primaryColor);
    $("#primary-color")[0].color.fromString(this.props.primaryColor);
    $("#secondary-color")[0].color.fromString(this.props.secondaryColor);
  },

  handlePrimaryColorChange: function (color) {
    this.props.onPrimaryColorChange(color);
  },

  handleSecondaryColorChange: function (color) {
    this.props.onSecondaryColorChange(color);
  }
});

export default ColorPicker;
