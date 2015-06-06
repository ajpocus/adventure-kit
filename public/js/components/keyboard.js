let React = require('react');
let $ = require('jquery');
let T = require('../lib/timbre');

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  componentDidMount: function () {
    $(this.refs.keyInput.getDOMNode()).focus();

    let synth = T('OscGen', { wave: 'saw', mul: 0.5 });

    this.setState({
      synth: synth
    });
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
      this.state.synth.noteOnWithFreq(880);
      this.setState({
        isPlaying: true
      });
    }
  },

  stopNote: function (ev) {
    if (this.state.isPlaying) {
      this.state.synth.noteOff(880);
      this.setState({
        isPlaying: false
      });
    }
  }
});

export default Keyboard;
