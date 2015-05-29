let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import EditPalette from './edit_palette';
import Transparency from '../mixins/transparency';

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: {
        "Rainbow": [
          tinycolor("#ff0000"), tinycolor("#ff7f00"), tinycolor("#ffff00"),
          tinycolor("#00ff00"), tinycolor("#0000ff"), tinycolor("#4b0082"),
          tinycolor("#8f00ff"), tinycolor("rgba(0, 0, 0, 0)")
        ]
      },
      currentPalette: "Rainbow"
    };
  },

  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.state.palettes) {
      if (this.state.palettes.hasOwnProperty(paletteName)) {
        let selected = "";
        if (paletteName === this.state.currentPalette) {
          selected = "selected";
        }

        paletteOptions.push(
          <option value={paletteName} selected={selected}>{paletteName}</option>
        );
      }
    }

    let currentPalette = this.state.palettes[this.state.currentPalette];
    let paletteColors = [];
    for (let i = 0; i < currentPalette.length; i++) {
      let color = currentPalette[i];

      // When transparent, use a checkerboard pattern.
      let liStyle = { background: color };
      if (color === "rgba(0, 0, 0, 0)") {
        liStyle.background = Transparency.background;
      }

      paletteColors.push(
        <li className="color" style={liStyle}
            onClick={this.selectColor.bind(this, color)}></li>
      );
    }

    return (
      <div className="palette-manager">
        <h2>Palette</h2>

        <button className="new-palette" onClick={this.newPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="currentPalette" className="palette-chooser">
          {paletteOptions}
        </select>

        <button className="edit-palette" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>
      </div>
    );
  },

  selectColor: function (color) {
    console.log(color);
    this.props.onColorChange(color);
  },

  newPalette: function () {
    let paletteName = prompt("New palette name");
    if (paletteName.length === 0) {
      return;
    }

    let newPalette = {};
    // Can't set in Object.assign because paletteName won't be eval'ed
    newPalette[paletteName] = {};
    let updatedPalettes = Object.assign(this.state.palettes, newPalette);

    this.setState({ palettes: updatedPalettes });
    this.setState({ currentPalette: paletteName });
  },

  editPalette: function () {
    let name = this.state.currentPalette;
    let palette = this.state.palettes[name];

    React.render(<EditPalette palette={palette} name={name}
                  onPaletteChange={this.onPaletteChange}/>,
                 document.getElementById('modal-container'));
  },

  onPaletteChange: function (palette) {
    let name = this.state.currentPalette;
    let palettes = this.state.palettes;
    palettes[name] = palette;
    this.setState({ palettes: palettes });
  }
});

export default PaletteManager;
