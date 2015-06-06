let React = require('react');
let $ = require('jquery');
let teoria = require('teoria');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false,
      ctx: new window.AudioContext(),
      oscillators: [],
      // instrument: this.props.instrument
      instrument: [
        {
          freqMult: 1,
          gain: 0.3,
          type: 'sawtooth'
        },
        {
          freqMult: 2,
          gain: 0.5,
          type: 'sine'
        },
        {
          freqMult: 4,
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

      let key = this.keyCodeToChar(ev.keyCode);
      let midi = this.keyToNote(key);
      console.log(midi);
      if (!midi) {
        return;
      }

      let note = teoria.note.fromMIDI(midi);
      let freq = note.fq();

      for (let i = 0; i < instrument.length; i++) {
        let wave = instrument[i];

        let osc = ctx.createOscillator();
        osc.frequency.value = wave.freqMult * freq;
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
  },

  keyToNote: function (key) {
    let keyMap = {
      'z': 60,  // C4
      's': 61,  // C#4
      'x': 62,  // D4
      'd': 63,  // D#4
      'c': 64,  // E4
      'v': 65,  // F4
      'g': 66,  // F#4
      'b': 67,  // G4
      'h': 68,  // G#4
      'n': 69,  // A4
      'j': 70,  // A#4
      'm': 71,  // B4
      ',': 72,  // C5
      'q': 72,  // C5 (again)
      '2': 73,  // C#5
      'w': 74,  // D5
      '3': 75,  // D#5
      'e': 76,  // E5
      'r': 77,  // F5
      '5': 78,  // F#5
      't': 79,  // G5
      '6': 80,  // G#5
      'y': 81,  // A5
      '7': 82,  // A#5
      'u': 83,  // B5
      'i': 84,  // C6
      '9': 85,  // C#6
      'o': 86,  // D6
      '0': 87,  // D#6
      'p': 88   // E6
    };

    return keyMap[key];
  },

  keyCodeToChar: function (keyCode) {
    let keyCodeMap = {
      48: '0',
      49: '1',
      50: '2',
      51: '3',
      54: '4',
      55: '5',
      56: '6',
      57: '7',
      58: '8',
      59: '9',
      65: 'a',
      66: 'b',
      67: 'c',
      68: 'd',
      69: 'e',
      70: 'f',
      71: 'g',
      72: 'h',
      73: 'i',
      74: 'j',
      75: 'k',
      76: 'l',
      77: 'm',
      78: 'n',
      79: 'o',
      80: 'p',
      81: 'q',
      82: 'r',
      83: 's',
      84: 't',
      85: 'u',
      86: 'v',
      87: 'w',
      88: 'x',
      89: 'y',
      90: 'z',
      186: ';',
      187: '=',
      188: ',',
      189: '-',
      190: '.',
      191: '/',
      219: '[',
      221: ']',
      222: "'"
    };

    return keyCodeMap[keyCode];
  }
});

export default Keyboard;
