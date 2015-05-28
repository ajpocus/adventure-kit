let React = require('react');

import DrawTools from './draw_tools';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <DrawTools/>
        <ColorPicker/>
        <DrawSurface/>
      </div>
    );
  }
});

export default Draw;
