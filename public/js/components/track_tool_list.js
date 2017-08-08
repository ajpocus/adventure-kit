let React = require('react');
import PropTypes from 'prop-types';

import ToolList from './tool_list';

class TrackToolList extends React.Component {
  getDefaultProps() {
    return {
      tools: [
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
          imgUrl: '/img/icons/glyphicons-176-stop.png'
        }
      ]
    };
  }

  render() {
    return (
      <div className="track-tools">
        <ToolList tools={this.props.tools}
                  activeTool={this.props.activeTool}
                  onSetActiveTool={this.props.onSetActiveTool}/>
      </div>
    );
  }
};

TrackToolList.propTypes = {
  onSetActiveTool: PropTypes.func.isRequired
}

export default TrackToolList;
