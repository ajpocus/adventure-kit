let React = require('react');
let $ = require('jquery');

import Transparency from '../mixins/transparency';
import DrawStoreActions from '../actions/draw_store_actions';

let EditPalette = React.createClass({
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
            onClick={this.setPaletteColor.bind(this, color)}>
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
                <input type="color" id="palette-color"
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
    document.getElementById('palette-color').value = this.props.activeColor;
  },

  setPaletteColor: function (color) {
    DrawStoreActions.setPaletteColor(color);
  },

  removePaletteColor: function (color) {
    DrawStoreActions.removePaletteColor(color);
  },

  addPaletteColor: function () {
    DrawStoreActions.addPaletteColor();
  },

  updatePaletteColor: function (ev) {
    let color = ev.target.value;
    DrawStoreActions.updateColor(color);
  },

  savePalette: function () {
    this.closeEdit();
  },

  closeEdit: function () {
    React.unmountComponentAtNode(document.getElementById('modal-container'));
  }
});

export default EditPalette;
