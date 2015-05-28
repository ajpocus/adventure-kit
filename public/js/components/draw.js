let React = require('react');

import DrawToolList from './draw_tool_list';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <DrawToolList/>
        <ColorPicker/>
        <DrawSurface/>
      </div>
    );
  }
});

export default Draw;
