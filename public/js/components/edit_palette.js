let React = require('react');
let $ = require('jquery');

import DrawActions from '../actions/draw_actions';
import Transparency from '../mixins/transparency';

let EditPalette = React.createClass({
  render: function () {
    let modalStyle = {};
    if (!this.props.isOpen) {
      modalStyle.display = 'none';
      return (<div style={{display: 'none'}}></div>);
    }

    let colorList = [];
    for (let i = 0; i < this.props.palette.length; i++) {
      let color = this.props.palette[i];
      let swatchStyle = { background: color };
      if (color === 'rgba(0, 0, 0, 0)') {
        swatchStyle.background = Transparency.background;
      }

      colorList.push(
        <li className="color"
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
      <li className="new color" onClick={this.addPaletteColor}>
        <div className="swatch">+</div>
      </li>
    );

    return (
      <div className="edit-palette modal" style={modalStyle}>
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
                <input type="color" id="palette-color"
                       onChange={this.updatePaletteColor}
                       ref="activePaletteColor"/>
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
    // Kludgy as fuck. Fix this, maybe with better modal handling.
    if (!this.props.isOpen) {
      return;
    }

    this.refs.activePaletteColor.getDOMNode().value = this.props.activePaletteColor;
  },

  addPaletteColor: function () {
    DrawActions.addPaletteColor();
  },

  removePaletteColor: function (color) {
    DrawActions.removePaletteColor(color);
  },

  setActivePaletteColor: function (color) {
    DrawActions.setActivePaletteColor(color);
  },

  updatePaletteColor: function (ev) {
    DrawActions.updatePaletteColor(ev.target.value);
  },

  savePalette: function () {
    DrawActions.savePalette();
    this.closeEdit();
  },

  closeEdit: function () {
    DrawActions.closeEditPalette();
  }
});

export default EditPalette;
