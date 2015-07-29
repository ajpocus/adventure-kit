let React = require('react');

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

let DrawToolList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Pencil',
          imgUrl: '/img/iconic/pencil.png'
        },
        {
          name: 'Bucket',
          imgUrl: '/img/iconic/droplet.png'
        },
        {
          name: 'Eyedropper',
          imgUrl: '/img/iconic/eyedropper.png'
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
