let React = require('react');
let $ = require('jquery');

import Transparency from '../lib/transparency';

let EditPalette = React.createClass({
  getInitialState: function () {
    return {
      palette: this.props.palette,
      activePaletteColor: this.props.palette[0]
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
                       ref="paletteColor"
                       id="palette-color"
                       value={this.state.activeColor}
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
    this.refs.paletteColor.getDOMNode().value = this.state.activeColor;
  },

  setActivePaletteColor: function (color) {
    this.setState({ activePaletteColor: color });
  },

  removePaletteColor: function (color) {
    let palette = this.state.palette;
    let idx = palette.indexOf(color);
    palette.splice(idx, 1);
    this.setState({ palette: palette });
  },

  addPaletteColor: function () {
    let palette = this.state.palette;
    let newColor = '#ffffff';
    palette.push(newColor);
    this.setState({ palette: palette, activePaletteColor: newColor });
  },

  updatePaletteColor: function (ev) {
    let color = ev.target.value;
    let palette = this.state.palette;
    let idx = palette.indexOf(this.state.activePaletteColor);
    palette[idx] = color;
    this.setState({ palette: palette, activePaletteColor: color });
  },

  savePalette: function () {
    this.props.onPaletteChange(this.state.palette);
    this.closeEdit();
  },

  closeEdit: function () {
    let container = document.getElementById('modal-container');
    React.unmountComponentAtNode(container);
  }
});

export default EditPalette;
