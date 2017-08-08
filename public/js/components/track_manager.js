let React = require('react');

import Track from './track';

const TrackManager = () => {
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
             trackState={trackState}
             isControllable={true}/>
    );
  }

  return (
    <ul className="track-list">
      {trackViews}

      <div className="scratch">
        <Track key="scratch"
               data={this.props.scratchTrack}
               trackState={this.props.scratchTrackState}
               isControllable={false}/>
      </div>
    </ul>
  );
};

export default TrackManager;
