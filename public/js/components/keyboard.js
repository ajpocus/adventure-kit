let React = require('react');
let $ = require('jquery');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false,
      ctx: new window.AudioContext(),
      oscillators: [],
      instrument: [
        {
          freq: 440,
          gain: 0.3,
          type: 'sawtooth'
        },
        {
          freq: 880,
          gain: 0.5,
          type: 'sine'
        },
        {
          freq: 1760,
          gain: 0.2,
          type: 'square'
        }
      ]
    };
  },

  componentDidMount: function () {
    $(this.refs.keyInput.getDOMNode()).focus();
  },

  render: function () {
    return (
      <div id="keyboard">
        <input className="key-input"
               ref="keyInput"
               readOnly="true"
               autofocus="true"
               onKeyDown={this.playNote}
               onKeyUp={this.stopNote}/>
      </div>
    );
  },

  playNote: function (ev) {
    if (!this.state.isPlaying) {
      let ctx = this.state.ctx;
      let instrument = this.state.instrument;
      let oscillators = [];

      for (let i = 0; i < instrument.length; i++) {
        let wave = instrument[i];

        let osc = ctx.createOscillator()
        osc.frequency.value = wave.freq;
        osc.type = wave.type;

        let gainNode = ctx.createGain();
        gainNode.gain.value = wave.gain;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        oscillators.push(osc);
      }

      this.setState({
        ctx: ctx,
        oscillators: oscillators,
        isPlaying: true
      });
    }
  },

  stopNote: function (ev) {
    if (this.state.isPlaying) {
      let oscillators = this.state.oscillators;

      for (let i = 0; i < oscillators.length; i++) {
        let osc = oscillators[i];
        osc.stop();
      }

      this.setState({
        oscillators: [],
        isPlaying: false
      });
    }
  }
});

export default Keyboard;
