let React = require('react');
let $ = require('jquery');
let teoria = require('teoria');

import MusicActions from '../actions/music_actions';
import KeyMapMixin from '../mixins/key_map_mixin';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Keyboard = React.createClass({
  mixins: [ KeyMapMixin ],

  getDefaultProps: function () {
    return {
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
    };
  },

  getInitialState: function () {
    return {
      ctx: new window.AudioContext(),
      oscillators: {},
      keysDown: {},
      notesPlaying: {},
      recordingIndices: {}
    };
  },

  componentDidMount: function () {
    $(document).on('keydown', this.handleKeyDown);
    $(document).on('keyup', this.handleKeyUp);

    requestAnimationFrame(this.animate);
  },

  componentWillUnmount: function () {
    $(document).off('keydown', this.handleKeyDown);
    $(document).off('keyup', this.handleKeyUp);
  },

  render: function () {
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
  },

  animate: function () {
    let keysDown = this.state.keysDown;
    let notesPlaying = this.state.notesPlaying;
    let oscillators = this.state.oscillators;
    let ctx = this.state.ctx;

    let recording = this.props.recording;
    let recordingIndices = this.state.recordingIndices;
    let instrument = this.props.instrument;

    for (let key in keysDown) {
      if (keysDown.hasOwnProperty(key)) {
        if (keysDown[key]) {
          if (notesPlaying[key]) {
            let idx = recordingIndices[key];
            recording[idx].endTime = Number(new Date());
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
          }
        } else {
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
          }
        }

        this.setState({ ctx, oscillators, notesPlaying, recordingIndices });
        MusicActions.updateRecording(recording);
      }
    }

    requestAnimationFrame(this.animate);
  },

  handleKeyDown: function (ev) {
    let key = this.keyCodeToChar(ev.keyCode);
    let keysDown = this.state.keysDown;
    keysDown[key] = true;
    this.setState({ keysDown });
  },

  handleKeyUp: function (ev) {
    let key = this.keyCodeToChar(ev.keyCode);
    let keysDown = this.state.keysDown;
    keysDown[key] = false;
    this.setState({ keysDown });
  }
});

export default Keyboard;
