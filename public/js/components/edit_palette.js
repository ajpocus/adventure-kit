let React = require('react');
let $ = require('jquery');
let Spectrum = require('../lib/spectrum');

import Transparency from '../mixins/transparency';

let EditPalette = React.createClass({
  getInitialState: function () {
    return {
      name: this.props.name,
      palette: this.props.palette
    };
  },

  render: function () {
    let colorList = [];
    for (let i = 0; i < this.state.palette.length; i++) {
      let color = this.state.palette[i];
      let swatchStyle = { background: color };
      if (color === 'rgba(0, 0, 0, 0)') {
        swatchStyle.background = Transparency.background;
      }

      colorList.push(
        <li className="color" onClick={this.setActiveColor.bind(this, color)}>
          <span className="remove" onClick={this.removeColor.bind(this, color)}>
            x
          </span>
          <div className="swatch" style={swatchStyle}></div>
        </li>
      );
    }

    colorList.push(
      <li className="new color" onClick={this.addColor}>
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
                <input type="color" className="color-picker"/>
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

  componentDidMount: function () {
    // set up spectrum
    Spectrum($);

    $(".edit-palette .color-picker").spectrum({
      flat: true,
      showInitial: true,
      showInput: true,
      preferredFormat: 'hex',
      change: this.updateColor,
      appendTo: $('#modal-container')
    });
  },

  componentDidUpdate: function () {
    $(".edit-palette .color-picker").spectrum('set', this.state.activeColor);
  },

  setActiveColor: function (color) {
    this.setState({ activeColor: color });
  },

  removeColor: function (color) {
    let idx = this.state.palette.indexOf(color);
    // Can't just splice and save the result, because it'll be the removed color
    let updatedPalette = this.state.palette;
    updatedPalette.splice(idx, 1);
    this.setState({ palette: updatedPalette });
  },

  addColor: function () {
    let palette = this.state.palette;
    palette.push("#000");
    this.setState({ activeColor: "#000", palette: palette });
  },

  updateColor: function (color) {
    let palette = this.state.palette;
    let idx = palette.indexOf(this.state.activeColor);
    palette[idx] = color;
    this.setState({ activeColor: color, palette: palette });
  },

  closeEdit: function () {
    $('.edit-palette .color-picker').spectrum('disable');
    React.unmountComponentAtNode(document.getElementById('modal-container'));
  },

  savePalette: function () {
    this.handlePaletteChange();
    this.closeEdit();
  },

  handlePaletteChange: function () {
    this.props.onPaletteChange(this.state.palette);
  }
});

export default EditPalette;
