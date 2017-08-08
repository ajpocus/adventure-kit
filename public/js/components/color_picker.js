import React from 'react';

import DrawActions from '../actions/draw_actions';

class ColorPicker extends React.Component {
  render() {
    return (
      <div className="color-picker">
        <input type="color"
               ref="primaryColor"
               id="primary-color"
               value={this.props.primaryColor}
               onChange={this.handlePrimaryColorChange}/>
        <input type="color"
               ref="secondaryColor"
               id="secondary-color"
               value={this.props.secondaryColor}
               onChange={this.handleSecondaryColorChange}/>
      </div>
    );
  }

  componentDidMount() {
    this.refs.primaryColor.getDOMNode().value = this.props.primaryColor;
    this.refs.secondaryColor.getDOMNode().value = this.props.secondaryColor;
  }

  componentDidUpdate() {
    this.refs.primaryColor.getDOMNode().value = this.props.primaryColor;
    this.refs.secondaryColor.getDOMNode().value = this.props.secondaryColor;
  }

  handlePrimaryColorChange(ev) {
    let color = ev.target.value;
    DrawActions.setPrimaryColor(color);
  }

  handleSecondaryColorChange(ev) {
    let color = ev.target.value;
    DrawActions.setSecondaryColor(color);
  }
};

export default ColorPicker;
