let React = require('react');

import TrackList from './track_list';
import Instrument from './instrument';
import Keyboard from './keyboard';

let Music = React.createClass({
  getInitialState: function () {
    return {
      instrument: [
        {
          frequency: 440,
          gain: 0.3,
          type: 'sawtooth'
        },
        {
          frequency: 880,
          gain: 0.5,
          type: 'sine'
        },
        {
          frequency: 1760,
          gain: 0.2,
          type: 'square'
        }
      ]
    };
  },

  render: function () {
    return (
      <div id="music">
        <TrackList/>
        <Instrument components={this.state.instrument}
                    onChange={this.onInstrumentChange}/>
        <Keyboard/>
      </div>
    );
  },

  onInstrumentChange: function (instrument) {
    this.setState({ instrument: instrument });
  }
});

export default Music;
