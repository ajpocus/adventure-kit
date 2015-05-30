let React = require('react');
let $ = require('jquery');
window.$ = $;
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
    document.getElementById('primary-color').value = this.props.primaryColor;
    document.getElementById('secondary-color').value = this.props.secondaryColor;
  },

  componentDidUpdate: function () {
    console.log("updating input", this.props.primaryColor);
    document.getElementById('primary-color').value = this.props.primaryColor;
    document.getElementById('secondary-color').value = this.props.secondaryColor;
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
