let React = require('react');

import MusicStore from '../stores/music_store';
import TrackManager from './track_manager';
import InstrumentList from './instrument_list';
import Keyboard from './keyboard';
import VolumeControl from './volume_control';

class MusicCtrl extends React.Component {
  constructor(props) {
    super(props);

    this.state = MusicStore.getState();
  }

  componentDidMount() {
    MusicStore.listen(this.onChange);
  }

  componentWillUnmount() {
    MusicStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let instrument = this.state.instruments[this.state.activeInstrument];
    return (
      <div id="music">
        <div className="top">
          <div className="sidebar">
            <InstrumentList instruments={this.state.instruments}
                            activeInstrument={this.state.activeInstrument}
                            instrumentCopy={this.state.instrumentCopy}
                            isEditingInstrument={this.state.isEditingInstrument}/>
          </div>

          <div className="main">
            <TrackManager tracks={this.state.tracks}
                          trackStates={this.state.trackStates}
                          scratchTrack={this.state.scratchTrack}
                          scratchTrackState={this.state.scratchTrackState}/>
          </div>
        </div>

        <div className="bottom">
          <div className="controls">
            <VolumeControl volume={this.state.volume}/>
            <Keyboard instrument={instrument}
                      volume={this.state.volume}
                      octaveShift={this.state.octaveShift}
                      recording={this.state.recording}
                      recordingIndices={this.state.recordingIndices}
                      trackIndices={this.state.trackIndices}/>
          </div>
        </div>
      </div>
    );
  }
};

export default MusicCtrl;
