let React = require('react');
let $ = require('jquery');
let assign = require('object-assign');

let ColorPicker = React.createClass({
  render: function () {
    return (
      <div className="color-picker">
        <input type="color" id="primary-color"
               onChange={this.handlePrimaryColorChange}/>
        <input type="color" id="secondary-color"
               onChange={this.handleSecondaryColorChange}/>
      </div>
    );
  },

  componentDidMount: function () {
    $("#primary-color").attr('value', this.props.primaryColor);
    $("#secondary-color").attr('value', this.props.secondaryColor);
  },

  handlePrimaryColorChange: function (ev) {
    let color = ev.target.value;
    this.props.onPrimaryColorChange(color);
  },

  handleSecondaryColorChange: function (ev) {
    let color = ev.target.value;
    this.props.onSecondaryColorChange(color);
  }
});

export default ColorPicker;
