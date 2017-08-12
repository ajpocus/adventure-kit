let React = require('react');
let $ = require('jquery');
let teoria = require('teoria');

import MusicActions from '../actions/music_actions';
import KeyMapMixin from '../mixins/key_map_mixin';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

class Keyboard extends React.Component {
  keyMap(key) {
    keys = {
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
  }

  keyCodeToChar() {
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
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
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

    return keyCodeMap[key]
  }

  constructor(props) {
    super(props);

    this.state = {
      ctx: new window.AudioContext(),
      oscillators: {},
      notesPlaying: {},
      recordingIndices: {}
    };
  }

  componentDidMount() {
    $(document).on('keydown', this.handleKeyDown);
    $(document).on('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    $(document).off('keydown', this.handleKeyDown);
    $(document).off('keyup', this.handleKeyUp);
  }

  render() {
    let whiteKeys = this.props.keys.white;
    let blackKeys = this.props.keys.black;
    let whiteKeyViews = [];
    let blackKeyViews = [];
    let octaveShift = this.props.octaveShift;
    let notesPerOctave = this.props.notesPerOctave;

    for (let i = 0; i < whiteKeys.length; i++) {
      let key = whiteKeys[i];
      let midi = notesPerOctave + key.midi + (notesPerOctave * octaveShift);
      let note = teoria.note.fromMIDI(midi);
      let scientific = note.scientific();

      whiteKeyViews.push(
        <li className="white key"
            key={midi}>
          <div className="char">{key.key}</div>
          <div className="note">{scientific}</div>
        </li>
      );
    }

    for (let i = 0; i < blackKeys.length; i++) {
      let key = blackKeys[i];

      if (key.spacer) {
        blackKeyViews.push(
          <li className="black key spacer"
              key={'spacer-' + i}></li>
        );

        continue;
      }

      let midi = notesPerOctave + key.midi + (notesPerOctave * octaveShift);
      let note = teoria.note.fromMIDI(midi);
      let scientific = note.scientific();
      scientific = scientific.replace('b', '♭');
      scientific = scientific.replace('#', '♯');

      blackKeyViews.push(
        <li className="black key"
            key={midi}>
          <div className="char">{key.key}</div>
          <div className="note">{scientific}</div>
        </li>
      );
    }

    return (
      <div id="keyboard">
        <ul className="white keys">
          {whiteKeyViews}
        </ul>
        <ul className="black keys">
          {blackKeyViews}
        </ul>
      </div>
    );
  }

  handleKeyDown(ev) {
    let key = this.keyCodeToChar(ev.keyCode);

    let notesPlaying = this.state.notesPlaying;
    let oscillators = this.state.oscillators;
    let ctx = this.state.ctx;

    let recording = this.props.recording;
    let recordingIndices = this.state.recordingIndices;
    let instrument = this.props.instrument;

    if (notesPlaying[key]) {
      let idx = recordingIndices[key];
      recording[idx].endTime = Number(new Date());

      this.setState({ recordingIndices });
      MusicActions.updateRecording(recording);
    } else {
      oscillators[key] = [];

      let midi = this.keyToNote(key);
      if (!midi) {
        return;
      }

      midi += this.props.octaveShift * 12
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

      notesPlaying[key] = true;

      let recording = this.props.recording;
      let now = Number(new Date());
      let chunk = {
        midi: midi,
        startTime: now
      };

      recording.push(chunk);
      recordingIndices[key] = recording.length - 1;

      this.setState({
        ctx, oscillators, notesPlaying, recordingIndices
      });
      MusicActions.updateRecording(recording);
    }
  }

  handleKeyUp(ev) {
    let key = this.keyCodeToChar(ev.keyCode);

    let notesPlaying = this.state.notesPlaying;
    let oscillators = this.state.oscillators;
    let ctx = this.state.ctx;

    let recording = this.props.recording;
    let recordingIndices = this.state.recordingIndices;

    if (notesPlaying[key]) {
      let noteOscillators = oscillators[key];
      let idx = recordingIndices[key];

      for (let i = 0; i < noteOscillators.length; i++) {
        let osc = noteOscillators[i];
        osc.stop();
      }

      recording[idx].endTime = Number(new Date());
      delete oscillators[key];
      delete notesPlaying[key];
      delete recordingIndices[key];

      this.setState({ oscillators, notesPlaying, recordingIndices });
      MusicActions.updateRecording(recording);
    }
  }
};

Keyboard.defaultProps = {
  keys: {
    white: [
      { key: 'Z', midi: 0 },
      { key: 'X', midi: 2 },
      { key: 'C', midi: 4 },
      { key: 'V', midi: 5 },
      { key: 'B', midi: 7 },
      { key: 'N', midi: 9 },
      { key: 'M', midi: 11 },
      { key: '< Q', midi: 12 },
      { key: 'W', midi: 14 },
      { key: 'E', midi: 16 },
      { key: 'R', midi: 17 },
      { key: 'T', midi: 19 },
      { key: 'Y', midi: 21 },
      { key: 'U', midi: 23 },
      { key: 'I', midi: 24 },
      { key: 'O', midi: 26 },
      { key: 'P', midi: 28 }
    ],
    black: [
      { key: 'S', midi: 1 },
      { key: 'D', midi: 3 },
      { spacer: true },
      { key: 'G', midi: 6 },
      { key: 'H', midi: 8 },
      { key: 'J', midi: 10 },
      { spacer: true },
      { key: '2', midi: 13 },
      { key: '3', midi: 15 },
      { spacer: true },
      { key: '5', midi: 18 },
      { key: '6', midi: 20 },
      { key: '7', midi: 22 },
      { spacer: true },
      { key: '9', midi: 25 },
      { key: '0', midi: 27 }
    ]
  },
  notesPerOctave: 12,
}

export default Keyboard;
