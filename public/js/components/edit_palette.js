let React = require('react');
let $ = require('jquery');

import DrawActions from '../actions/draw_actions';
import Transparency from '../mixins/transparency';

let EditPalette = React.createClass({
  componentDidMount: function () {
    this.refs.paletteColor.getDOMNode().value = this.props.activePaletteColor;
  },

  componentDidUpdate: function () {
    this.refs.paletteColor.getDOMNode().value = this.props.activePaletteColor;
  },

  render: function () {
    let colorList = [];
    for (let i = 0; i < this.props.paletteCopy.length; i++) {
      let color = this.props.paletteCopy[i];
      let swatchStyle = { background: color };
      if (color === 'rgba(0, 0, 0, 0)') {
        swatchStyle.background = Transparency.background;
      }

      colorList.push(
        <li className="color"
            key={i}
            onClick={this.setActiveColor.bind(this, color)}>
          <span className="remove"
                onClick={this.removeColor.bind(this, color)}>
            x
          </span>
          <div className="swatch" style={swatchStyle}></div>
        </li>
      );
    }

    colorList.push(
      <li className="new color" key="new" onClick={this.addColor}>
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
                       ref="paletteColor"
                       id="palette-color"
                       onChange={this.updateColor}/>
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


  setActiveColor: function (color) {
    DrawActions.setActiveColor(color);
  },

  removeColor: function (color) {
    DrawActions.removeColor(color);
  },

  addColor: function () {
    DrawActions.addColor();
  },

  updateColor: function (ev) {
    let color = ev.target.value;
    DrawActions.updateColor(color);
  },

  savePalette: function () {
    DrawActions.updatePalette();
    this.closeEdit();
  },

  closeEdit: function () {
    DrawActions.closeEditPalette();
  }
});

export default EditPalette;
