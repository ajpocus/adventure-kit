let React = require('react');
let $ = require('jquery');
let teoria = require('teoria');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: {},
      ctx: new window.AudioContext(),
      oscillators: {},
      octaveShift: 2
    };
  },

  componentDidMount: function () {
    $(document).on('keydown', this.handleKeyDown);
    $(document).on('keyup', this.handleKeyUp);
  },

  componentWillUnmount: function () {
    $(document).off('keydown', this.handleKeyDown);
    $(document).off('keyup', this.handleKeyUp);
  },

  render: function () {
    return (
      <div id="keyboard">
        <input className="key-input"
               ref="keyInput"
               readOnly="true"
               autofocus="true"
               onKeyDown={this.handleKeyDown}
               onKeyUp={this.handleKeyUp}/>
      </div>
    );
  },

  handleKeyDown: function (ev) {
    let key = this.keyCodeToChar(ev.keyCode);

    if (!this.state.isPlaying[key]) {
      let ctx = this.state.ctx;
      let oscillators = this.state.oscillators;
      let isPlaying = this.state.isPlaying;
      let instrument = this.props.instrument;
      oscillators[key] = [];

      let midi = this.keyToNote(key);
      if (!midi) {
        return;
      }

      midi += this.state.octaveShift * 12
      let note = teoria.note.fromMIDI(midi);
      let freq = note.fq();

      for (let i = 0; i < instrument.components.length; i++) {
        let wave = instrument.components[i];

        let osc = ctx.createOscillator();
        osc.frequency.value = freq * Math.pow(2, wave.harmonic);
        osc.type = wave.type;

        let gainNode = ctx.createGain();
        gainNode.gain.value = wave.gain * this.props.volume * 2;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        oscillators[key].push(osc);
      }

      isPlaying[key] = true;

      this.setState({
        ctx: ctx,
        oscillators: oscillators,
        isPlaying: isPlaying
      });
    }
  },

  handleKeyUp: function (ev) {
    let key = this.keyCodeToChar(ev.keyCode);
    let isPlaying = this.state.isPlaying;

    if (isPlaying[key]) {
      let oscillators = this.state.oscillators;

      for (let i = 0; i < oscillators[key].length; i++) {
        let osc = oscillators[key][i];
        osc.stop();
      }

      delete oscillators[key];
      delete isPlaying[key];

      this.setState({
        oscillators: oscillators,
        isPlaying: isPlaying
      });
    }
  },

  keyToNote: function (key) {
    // To shift up an octave, add 12. To shift down, subtract 12.
    let keyMap = {
      'z': 12,  // C0
      's': 13,  // C#0
      'x': 14,  // D0
      'd': 15,  // D#0
      'c': 16,  // E0
      'v': 17,  // F0
      'g': 18,  // F#0
      'b': 19,  // G0
      'h': 20,  // G#0
      'n': 21,  // A0
      'j': 22,  // A#0
      'm': 23,  // B0
      ',': 24,  // C1
      'q': 24,  // C1 (again)
      '2': 25,  // C#1
      'w': 26,  // D1
      '3': 27,  // D#1
      'e': 28,  // E1
      'r': 29,  // F1
      '5': 30,  // F#1
      't': 31,  // G1
      '6': 32,  // G#1
      'y': 33,  // A1
      '7': 34,  // A#1
      'u': 35,  // B1
      'i': 36,  // C2
      '9': 37,  // C#2
      'o': 38,  // D2
      '0': 39,  // D#2
      'p': 40   // E2
    };

    return keyMap[key];
  },

  keyCodeToChar: function (keyCode) {
    let keyCodeMap = {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      16: 'Shift',
      17: 'Ctrl',
      18: 'Alt',
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
