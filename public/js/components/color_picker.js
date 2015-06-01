let React = require('react');

import DrawActions from '../actions/draw_actions';

let ColorPicker = React.createClass({
  render: function () {
    return (
      <div className="color-picker">
        <input type="color" id="primary-color"
               onChange={this.onPrimaryColorChange}/>
        <input type="color" id="secondary-color"
               onChange={this.onSecondaryColorChange}/>
      </div>
    );
  },

  componentDidMount: function () {
    document.getElementById('primary-color').value = this.props.primaryColor;
    document.getElementById('secondary-color').value = this.props.secondaryColor;
  },

  componentDidUpdate: function () {
    document.getElementById('primary-color').value = this.props.primaryColor;
    document.getElementById('secondary-color').value = this.props.secondaryColor;
  },

  onPrimaryColorChange: function (ev) {
    let color = ev.target.value;
    DrawActions.setPrimaryColor(color);
  },

  onSecondaryColorChange: function (ev) {
    let color = ev.target.value;
    DrawActions.setSecondaryColor(color);
  }
});

export default ColorPicker;
