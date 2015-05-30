let React = require('react');
let $ = require('jquery');
let assign = require('object-assign');
let JSColor = require('../lib/jscolor');

let ColorPicker = React.createClass({
  render: function () {
    let colorClass = "color {hash:true}";

    return (
      <div className="color-picker">
        <input id="primary-color" className={colorClass}/>
        <input id="secondary-color" className={colorClass}/>
      </div>
    );
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
