let React = require('react');

import Track from './track';

let TrackManager = React.createClass({
  getDefaultProps: function () {
    return {
      trackCount: 5
    };
  },

  getInitialState: function () {
    let trackCount = this.props.trackCount;
    let trackStates = [];
    for (let i = 0; i < trackCount; i++) {
      let isRecording = false;
      let isStopped = true;
      let lastIdx = trackCount - 1;
      let activeTool = 'Stop';

      if (i === lastIdx) {
        isRecording = true;
        isStopped = false;
        activeTool = 'Record';
      }

      trackStates.push({
        isRecording,
        isPlaying: false,
        isPaused: false,
        isStopped,
        activeTool
      });
    }

    return {
      trackStates
    };
  },

  render: function () {
    let trackViews = [];
    let trackStates = this.state.trackStates;
    let lastIdx = this.props.trackCount - 1;

    for (let i = 0; i < this.props.trackCount; i++) {
      let trackState = trackStates[i];
      let data;
      if (i === lastIdx) {
        data = this.props.recording;
      }

      trackViews.push(
        <Track data={this.props.tracks[i]}
               key={i}
               trackNumber={i}
               data={data}
               isRecording={trackState.isRecording}
               isPlaying={trackState.isPlaying}
               isPaused={trackState.isPaused}
               isStopped={trackState.isStopped}
               activeTool={trackState.activeTool}
               onTrackStateChange={this.onTrackStateChange}/>
      );
    }

    return (
      <ul className="track-list">
        {trackViews}
      </ul>
    );
  },

  onTrackStateChange: function (trackNumber, newState) {
    let trackStates = this.state.trackStates;
    trackStates[trackNumber] = newState;
  }
});

export default TrackManager;
