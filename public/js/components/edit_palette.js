let React = require('react');
let $ = require('jquery');

import DrawStoreActions from '../actions/draw_store_actions';
import Transparency from '../lib/transparency';

let EditPalette = React.createClass({
  getDefaultProps: function () {
    return {
      palette: []
    };
  },

  render: function () {
    let colorList = [];
    for (let i = 0; i < this.props.palette.length; i++) {
      let color = this.props.palette[i];
      let swatchStyle = { background: color };
      if (color === 'rgba(0, 0, 0, 0)') {
        swatchStyle.background = Transparency.background;
      }

      colorList.push(
        <li className="color"
            key={i}
            onClick={this.setActivePaletteColor.bind(this, color)}>
          <span className="remove"
                onClick={this.removePaletteColor.bind(this, color)}>
            x
          </span>
          <div className="swatch" style={swatchStyle}></div>
        </li>
      );
    }

    colorList.push(
      <li className="new color" key="new" onClick={this.addPaletteColor}>
        <div className="swatch">+</div>
      </li>
    );

    return (
      <div className="edit-palette modal">
        <div className="modal-background">
          <div className="modal-content">
            <div className="header">
              <h3>Edit Palette</h3>
              <span className="palette-name">{this.props.name}</span>
              <span className="close-modal" onClick={this.closeEdit}>x</span>
            </div>

            <div className="content">
              <ul className="colors">
                {colorList}
              </ul>

              <div className="sidebar">
                <input type="color"
                       id="palette-color"
                       ref="paletteColor"
                       onChange={this.updatePaletteColor}/>
                <button className="add btn">Add color</button>
              </div>
            </div>

            <div className="buttons">
              <button className="cancel btn" onClick={this.closeEdit}>
                Cancel
              </button>

              <button className="save btn" onClick={this.savePalette}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentDidUpdate: function () {
    this.refs.paletteColor.getDOMNode().value = this.props.activePaletteColor;
  },

  setActivePaletteColor: function (color) {
    DrawStoreActions.setActivePaletteColor(color);
  },

  removePaletteColor: function (color) {
    DrawStoreActions.removePaletteColor(color);
  },

  addPaletteColor: function () {
    DrawStoreActions.addPaletteColor();
  },

  updatePaletteColor: function (ev) {
    let color = ev.target.value;
    DrawStoreActions.updatePaletteColor(color);
  },

  savePalette: function () {
    DrawStoreActions.savePalette();
    this.closeEdit();
  },

  closeEdit: function () {
    DrawStoreActions.closeEdit();
  }
});

export default EditPalette;
