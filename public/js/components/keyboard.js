let React = require('react');
let $ = require('jquery');
let teoria = require('teoria');
let _ = require('underscore');

import KeyMapMixin from '../mixins/key_map_mixin';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Keyboard = React.createClass({
  mixins: [ KeyMapMixin ],

  getInitialState: function () {
    return {
      isPlaying: {},
      ctx: new window.AudioContext(),
      oscillators: {},
      octaveShift: 2,
      recording: [],
      indices: {}
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
    let whiteKeys = [];
    let blackKeys = [];

    return (
      <div id="keyboard">
        <ul className="white keys">
          <li className="white key c">
            <div className="char">Z</div>
            <div className="note">C2</div>
          </li>

          <li className="white key d">
            <div className="char">X</div>
            <div className="note">D2</div>
          </li>

          <li className="white key e">
            <div className="char">C</div>
            <div className="note">E2</div>
          </li>

          <li className="white key f">
            <div className="char">V</div>
            <div className="note">F2</div>
          </li>

          <li className="white key g">
            <div className="char">B</div>
            <div className="note">G2</div>
          </li>

          <li className="white key a">
            <div className="char">N</div>
            <div className="note">A2</div>
          </li>

          <li className="white key b">
            <div className="char">M</div>
            <div className="note">B2</div>
          </li>

          <li className="white key c">
            <div className="char">&lt;<br/>Q</div>
            <div className="note">C3</div>
          </li>

          <li className="white key d">
            <div className="char">W</div>
            <div className="note">D3</div>
          </li>

          <li className="white key e">
            <div className="char">E</div>
            <div className="note">E3</div>
          </li>

          <li className="white key f">
            <div className="char">R</div>
            <div className="note">F3</div>
          </li>

          <li className="white key g">
            <div className="char">T</div>
            <div className="note">G3</div>
          </li>

          <li className="white key a">
            <div className="char">Y</div>
            <div className="note">A3</div>
          </li>

          <li className="white key b">
            <div className="char">I</div>
            <div className="note">B3</div>
          </li>

          <li className="white key c">
            <div className="char">O</div>
            <div className="note">C4</div>
          </li>

          <li className="white key d">
            <div className="char">U</div>
            <div className="note">D4</div>
          </li>

          <li className="white key e">
            <div className="char">P</div>
            <div className="note">E4</div>
          </li>
        </ul>

        <ul className="black keys">
          <li className="black key first">
            <div className="char">S</div>
            <div className="note">C#2</div>
          </li>

          <li className="black key">
            <div className="char">D</div>
            <div className="note">D#2</div>
          </li>

          <li className="black spacer key"></li>

          <li className="black key">
            <div className="char">G</div>
            <div className="note">F#2</div>
          </li>

          <li className="black key">
            <div className="char">H</div>
            <div className="note">G#2</div>
          </li>

          <li className="black key">
            <div className="char">J</div>
            <div className="note">A#2</div>
          </li>

          <li className="black spacer key"></li>

          <li className="black key">
            <div className="char">2</div>
            <div className="note">C#3</div>
          </li>

          <li className="black key">
            <div className="char">3</div>
            <div className="note">D#3</div>
          </li>

          <li className="black spacer key"></li>

          <li className="black key">
            <div className="char">5</div>
            <div className="note">F#3</div>
          </li>

          <li className="black key">
            <div className="char">6</div>
            <div className="note">G#3</div>
          </li>

          <li className="black key">
            <div className="char">7</div>
            <div className="note">A#3</div>
          </li>

          <li className="black spacer key"></li>

          <li className="black key">
            <div className="char">9</div>
            <div className="note">C#4</div>
          </li>

          <li className="black key">
            <div className="char">0</div>
            <div className="note">D#4</div>
          </li>
        </ul>
      </div>
    );
  },

  handleKeyDown: function (ev) {
    let key = this.keyCodeToChar(ev.keyCode);

    if (this.state.isPlaying[key]) {
      let indices = this.state.indices;
      let idx = indices[key];
      let recording = this.state.recording;
      recording[idx].endTime = Number(new Date());

      this.setState({
        recording: recording
      }, function () {
        this.props.onRecordingUpdate(this.state.recording);
      });
    } else {
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

      let recording = this.state.recording;
      let now = Number(new Date());
      recording.push({
        midi: midi,
        startTime: now,
        endTime: now + 1
      });

      let indices = this.state.indices;
      indices[key] = recording.length - 1;

      this.setState({
        ctx: ctx,
        oscillators: oscillators,
        isPlaying: isPlaying,
        recording: recording,
        indices: indices
      }, function () {
        this.props.onRecordingUpdate(this.state.recording);
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

      let indices = this.state.indices;
      let recording = this.state.recording;
      let idx = this.state.indices[key];
      recording[idx].endTime = Number(new Date());
      delete indices[key];

      this.setState({
        oscillators: oscillators,
        isPlaying: isPlaying,
        recording: recording,
        indices: indices
      }, function () {
        this.props.onRecordingUpdate(this.state.recording);
      });
    }
  }
});

export default Keyboard;
