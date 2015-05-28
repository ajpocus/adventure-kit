let React = require('react');

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: {
        "Rainbow": [
          "#ff00000", "#ff7f00", "#ffff00", "#00ff00",
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
        <li className="color" style={liStyle}></li>
      );
    }

    return (
      <div className="palette-manager">
        <select name="currentPalette" className="palette-chooser">
          {paletteOptions}
        </select>

        <ul className="palette">
          {paletteColors}
        </ul>
      </div>
    );
  }
});

export default PaletteManager;
