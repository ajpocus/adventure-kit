let React = require('react');

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

let DrawToolList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Pencil',
          imgUrl: '/img/icons/glyphicons-31-pencil.png'
        },
        {
          name: 'Bucket',
          imgUrl: '/img/icons/glyphicons-481-bucket.png'
        },
        {
          name: 'Zoom In',
          imgUrl: '/img/icons/glyphicons-237-zoom-in.png'
        },
        {
          name: 'Zoom Out',
          imgUrl: '/img/icons/glyphicons-238-zoom-out.png'
        }
      ]
    }
  },

  render: function () {
    return (
      <div className="draw-tools">
        <ToolList tools={this.props.tools}
                  activeTool={this.props.activeTool}
                  onSetActiveTool={this.onSetActiveTool}/>
      </div>
    );
  },

  onSetActiveTool: function (tool) {
    DrawActions.setActiveTool(tool);
  }
});

export default DrawToolList;
