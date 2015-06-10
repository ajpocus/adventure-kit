let React = require('react');

import TrackList from './track_list';
import InstrumentList from './instrument_list';
import Keyboard from './keyboard';

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
      activeInstrument: 0
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
        <Keyboard instrument={instrument}/>
      </div>
    );
  },

  onUpdate: function (newState) {
    this.setState(newState);
  }
});

export default Music;
