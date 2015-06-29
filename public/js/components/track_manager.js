let React = require('react');

import Track from './track';

let TrackManager = React.createClass({
  render: function () {
    let tracks = this.props.tracks;
    let trackStates = this.props.trackStates;
    let lastIdx = tracks.length - 1;
    let trackViews = [];

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      let trackState = trackStates[i];

      trackViews.push(
        <Track key={i}
               data={track}
               trackNumber={i}
               trackState={trackState}/>
      );
    }

    return (
      <ul className="track-list">
        {trackViews}
      </ul>
    );
  }
});

export default TrackManager;
