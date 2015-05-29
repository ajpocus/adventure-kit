let React = require('react');
let tinycolor = require('tinycolor2');

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: {
        "Rainbow": [
          "#ff0000", "#ff7f00", "#ffff00", "#00ff00",
          "#0000ff", "#4b0082", "#8f00ff"
        ]
      },
      currentPalette: "Rainbow"
    };
  },

  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.state.palettes) {
      if (this.state.palettes.hasOwnProperty(paletteName)) {
        paletteOptions.push(
          <option value={paletteName}>{paletteName}</option>
        );
      }
    }

    let currentPalette = this.state.palettes[this.state.currentPalette];
    let paletteColors = [];
    for (let i = 0; i < currentPalette.length; i++) {
      let color = currentPalette[i];
      let liStyle = { background: color };

      paletteColors.push(
        <li className="color" style={liStyle}
            onClick={this.selectColor.bind(this, color)}></li>
      );
    }

    return (
      <div className="palette-manager">
        <h2>Palette</h2>
        <select name="currentPalette" className="palette-chooser">
          {paletteOptions}
        </select>
        <button className="new-palette" onClick={this.newPalette}>
          +
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>
      </div>
    );
  },

  selectColor: function (color) {
    console.log(color);
    this.props.onColorChange(tinycolor(color));
  },

  newPalette: function () {
    let paletteName = prompt("New palette name");
    console.log(paletteName);
    this.state.palettes[paletteName] = {};
  }
});

export default PaletteManager;
