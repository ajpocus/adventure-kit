let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import DrawActions from '../actions/draw_actions';
import Transparency from '../mixins/transparency';
import Modal from './modal';

let PaletteManager = React.createClass({
  render: function () {
    let paletteColors = [];
    for (let i = 0; i < this.props.palette.length; i++) {
      let color = this.props.palette[i];
      let liStyle = { background: color };
      let liClassName = 'color';
      if (color === this.props.primaryColor) {
        liClassName += ' active';
      }

      paletteColors.push(
        <li className={liClassName}
            style={liStyle}
            key={i}
            onClick={this.setPrimaryColor.bind(this, color)}></li>
      );
    }

    return (
      <div className="palette-manager">
        <ul className="palette">
          {paletteColors}
        </ul>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    DrawActions.setPrimaryColor(color);
  }
});

export default PaletteManager;
