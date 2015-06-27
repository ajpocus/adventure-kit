let React = require('react');

import ToolList from './tool_list';

let TrackToolList = React.createClass({
  propTypes: {
    onSetActiveTool: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Record',
          imgUrl: '/img/icons/glyphicons-170-record.png'
        },
        {
          name: 'Play',
          imgUrl: '/img/icons/glyphicons-174-play.png'
        },
        {
          name: 'Pause',
          imgUrl: '/img/icons/glyphicons-175-pause.png'
        },
        {
          name: 'Stop',
          active: true,
          imgUrl: '/img/icons/glyphicons-176-stop.png'
        }
      ]
    };
  },

  render: function () {
    return (
      <div className="track-tools">
        <ToolList tools={this.props.tools}
                  onSetActiveTool={this.props.onSetActiveTool}/>
      </div>
    );
  }
});

export default TrackToolList;
