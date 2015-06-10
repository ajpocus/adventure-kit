let React = require('react');

import TrackList from './track_list';
import InstrumentList from './instrument_list';
import Keyboard from './keyboard';
import VolumeControl from './volume_control';

let Music = React.createClass({
  getInitialState: function () {
    return {
      instruments: [
        {
          name: '8-bit Synth',
          components: [
            {
              harmonic: 0,
              gain: 0.3,
              type: 'sawtooth',
              key: Math.random()
            },
            {
              harmonic: 1,
              gain: 0.5,
              type: 'sine',
              key: Math.random()
            },
            {
              harmonic: 2,
              gain: 0.2,
              type: 'square',
              key: Math.random()
            }
          ]
        }
      ],
      activeInstrument: 0,
      volume: 0.5
    };
  },

  render: function () {
    let instrument = this.state.instruments[this.state.activeInstrument];
    return (
      <div id="music">
        <TrackList/>
        <InstrumentList instruments={this.state.instruments}
                        activeInstrument={this.state.activeInstrument}
                        onUpdate={this.onUpdate}/>
        <Keyboard instrument={instrument}
                  volume={this.state.volume}/>
        <VolumeControl gain="0.5"
                       onVolumeChange={this.onVolumeChange}/>
      </div>
    );
  },

  onUpdate: function (newState) {
    this.setState(newState);
  },

  onVolumeChange: function (volume) {
    this.setState({ volume: volume });
  }
});

export default Music;
