let React = require('react');
let $ = require('jquery');

import Pixel from '../models/pixel';
import Transparency from '../mixins/transparency';

let DrawCanvas = React.createClass({
  getInitialState: function () {
    return {
      isMouseDown: false,
      zoom: this.props.zoom,
      width: this.props.width,
      height: this.props.height,
      actualWidth: this.props.actualWidth,
      actualHeight: this.props.actualHeight,
      tileWidth: this.props.tileWidth,
      tileHeight: this.props.tileHeight
    };
  },

  componentDidMount: function () {},

  render: function () {
    let surfaceTop = (this.props.totalHeight - this.state.actualHeight) / 2;
    let surfaceLeft = (this.props.totalWidth - this.state.actualWidth) / 2;
    let surfaceStyle = {
      width: this.state.actualWidth,
      height: this.state.actualHeight,
      top: surfaceTop,
      left: surfaceLeft
    };

    return (
      <div id="render">
        <div className="background">
          <div className="surface"
               style={surfaceStyle}
               onMouseMove={this.handleMouseMove}
               onMouseOut={this.handleMouseOut}
               onMouseDown={this.handleMouseDown}
               onContextMenu={this.handleMouseDown}
               onMouseUp={this.handleMouseUp}>
            <canvas id="bg-canvas"
                    className="draw"
                    ref="bgCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
            <canvas id="draw-canvas"
                    className="draw"
                    ref="drawCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
            <canvas id="overlay-canvas"
                    className="draw"
                    ref="overlayCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
          </div>
        </div>
      </div>
    );
  },

  handleMouseMove: function (ev) {
    console.log('mousemove', ev);
  },

  handleMouseOut: function (ev) {
    console.log('mouseout');
  },

  handleMouseDown: function (ev) {
    console.log('mousedown');
  },

  handleMouseUp: function (ev) {
    console.log('mouseup');
  }
});

export default DrawCanvas;
