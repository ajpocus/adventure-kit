let React = require('react');

import MusicStore from '../stores/music_store';
import TrackManager from './track_manager';
import InstrumentList from './instrument_list';
import Keyboard from './keyboard';
import VolumeControl from './volume_control';

let MusicCtrl = React.createClass({
  getInitialState: function () {
    return MusicStore.getState();
  },

  componentDidMount: function () {
    MusicStore.listen(this.onChange);
  },

  componentWillUnmount: function () {
    MusicStore.unlisten(this.onChange);
  },

  onChange: function (state) {
    this.setState(state);
  },

  render: function () {
    let instrument = this.state.instruments[this.state.activeInstrument];
    return (
      <div id="music">
        <div className="top">
          <div className="sidebar">
            <InstrumentList instruments={this.state.instruments}
                            activeInstrument={this.state.activeInstrument}
                            instrumentCopy={this.state.instrumentCopy}/>
          </div>

          <div className="main">
            <TrackManager tracks={this.state.tracks}
                          recording={this.state.recording}/>
          </div>
        </div>

        <div className="bottom">
          <div className="controls">
            <VolumeControl volume={this.state.volume}
                           onVolumeChange={this.onVolumeChange}/>
            <Keyboard instrument={instrument}
                      volume={this.state.volume}
                      isRecording={this.state.isRecording}
                      onRecordingUpdate={this.onRecordingUpdate}/>
          </div>
        </div>
      </div>
    );
  },

  onUpdate: function (newState) {
    this.setState(newState);
  },

  onVolumeChange: function (volume) {
    this.setState({ volume: volume });
  },

  onRecordingUpdate: function (recording) {
    this.setState({ recording: recording });
  }
});

export default MusicCtrl;
