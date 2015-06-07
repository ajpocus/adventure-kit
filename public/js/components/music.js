let React = require('react');

import TrackList from './track_list';
import InstrumentList from './instrument_list';
import Keyboard from './keyboard';

let Music = React.createClass({
  getInitialState: function () {
    return {
      activeInstrument: {
        name: '8-bit Synth',
        components: [
          {
            harmonic: 0,
            gain: 0.3,
            type: 'sawtooth'
          },
          {
            harmonic: 1,
            gain: 0.5,
            type: 'sine'
          },
          {
            harmonic: 2,
            gain: 0.2,
            type: 'square'
          }
        ]
      }
    };
  },

  render: function () {
    return (
      <div id="music">
        <TrackList/>
        <InstrumentList activeInstrument={this.state.activeInstrument}
                        onInstrumentChange={this.onInstrumentChange}/>
        <Keyboard instrument={this.state.activeInstrument}/>
      </div>
    );
  },

  onInstrumentChange: function (instrument) {
    this.setState({ activeInstrument: instrument });
  }
});

export default Music;
