let React = require('react');
let $ = require('jquery');

import DrawStoreActions from '../actions/draw_store_actions';

let ColorPicker = React.createClass({
  render: function () {
    return (
      <div className="color-picker">
        <input type="color" id="primary-color"
               onChange={this.setPrimaryColor}/>
        <input type="color" id="secondary-color"
               onChange={this.setSecondaryColor}/>
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

  setPrimaryColor: function (ev) {
    let color = ev.target.value;
    DrawStoreActions.setPrimaryColor(color);
  },

  setSecondaryColor: function (ev) {
    let color = ev.target.value;
    DrawStoreActions.setSecondaryColor(color);
  }
});

export default ColorPicker;
