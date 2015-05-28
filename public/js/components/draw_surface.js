let React = require('react');
let $ = require('jquery');
let PIXI = require('pixi.js');

import TiledSurface from '../mixins/tiled_surface';

let DrawCanvas = React.createClass({
  mixins: [TiledSurface],

  getInitialState: function () {
    return {
      isMouseDown: false
    };
  },

  getDefaultProps: function () {
    return {
      bgTileSize: 8
    };
  },

  render: function () {
    return (
      <div id="render"
          onMouseMove={this.mouseMoved}
          onMouseOut={this.clearHighlight}
          onMouseDown={this.paintPixel}
          onContextMenu={this.paintPixel}
          onMouseUp={this.setMouseUp}>
      </div>
    );
  },

  componentDidMount: function () {
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.props.width,
                                            this.props.height);
    React.findDOMNode(this).appendChild(this.renderer.view);

    this.bgGfx = new PIXI.Graphics();
    this.drawGfx = new PIXI.Graphics();
    this.overlayGfx = new PIXI.Graphics();
    this.stage.addChild(this.bgGfx);
    this.stage.addChild(this.drawGfx);
    this.stage.addChild(this.overlayGfx);

    this.initBackground();

    var component = this;
    (function render() {
      requestAnimationFrame(render);

      component.renderer.render(component.stage);
    })();
  },

  initBackground: function () {
    let numTilesH = this.props.width / this.props.bgTileSize;
    let numTilesV = this.props.height / this.props.bgTileSize;

    for (let i = 0; i < numTilesH; i++) {
      for (let j = 0; j < numTilesV; j++) {
        let x = i * this.props.bgTileSize;
        let y = j * this.props.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? 0x999999 : 0x777777;

        this.bgGfx.beginFill(fill);
        this.bgGfx.drawRect(x, y, this.props.bgTileSize, this.props.bgTileSize);
      }
    }
  },

  mouseMoved: function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let numPixels = this.state.grid.length;
    let currentPixel = this.state.grid[x][y];

    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.props.tileSize;
      let fillY = currentPixel.y * this.props.tileSize;

      this.overlayGfx.beginFill(0xffffff, 0.2);
      this.overlayGfx.drawRect(fillX, fillY, this.props.tileSize,
                               this.props.tileSize);
      currentPixel.highlighted = true;
    }

    this.clearHighlight(null, currentPixel);

    if (this.state.isMouseDown) {
      this.paintPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    this.overlayGfx.clear();
    if (currentPixel) {
      let fillX = currentPixel.x * this.props.tileSize;
      let fillY = currentPixel.y * this.props.tileSize;

      this.overlayGfx.beginFill(0xffffff, 0.2);
      this.overlayGfx.drawRect(fillX, fillY, this.props.tileSize,
                               this.props.tileSize);
    }
  },

  paintPixel: function (ev) {
    ev.preventDefault();
    this.setState({ isMouseDown: true });

    let { x, y } = this.getTileCoordinates(ev);
    let pixel = this.state.grid[x][y];
    let fillX = x * this.props.tileSize;
    let fillY = y * this.props.tileSize;

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;
    let alpha = this.props.primaryColorAlpha;

    if (button === 2) {
      color = this.props.secondaryColor;
      alpha = this.props.secondaryColorAlpha;
    }

    console.log(color);
    console.log(alpha);
    this.drawGfx.beginFill(color, alpha);
    this.drawGfx.drawRect(fillX, fillY, this.props.tileSize,
                          this.props.tileSize);
    pixel.color = color;
  },

  setMouseUp: function () {
    this.setState({ isMouseDown: false });
  }
});

export default DrawCanvas;
