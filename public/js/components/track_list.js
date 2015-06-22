let React = require('react');

import Track from './track';

let TrackList = React.createClass({
  getDefaultProps: function () {
    return {
      trackCount: 4
    };
  },

  render: function () {
    let trackViews = [];
    for (let i = 0; i < this.props.trackCount; i++) {
      trackViews.push(
        <Track data={this.props.tracks[i]}
               key={i}/>
      );
    }

    return (
      <ul className="track-list">
        {trackViews}

        <Track data={this.props.recording}/>
      </ul>
    );
  }
});

export default TrackList;
