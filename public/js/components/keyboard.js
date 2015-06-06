let React = require('react');
let $ = require('jquery');

require('../lib/beep/Beep.js');
require('../lib/beep/Beep.Note.js');
require('../lib/beep/Beep.Voice.js');
require('../lib/beep/Beep.Sample.js');
require('../lib/beep/Beep.Trigger.js');
require('../lib/beep/Beep.Instrument.js');

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  componentDidMount: function () {
    let voice = new Beep.Voice('2Eb');

    this.setState({
      voice: voice
    });

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
      this.state.voice.play();
      this.setState({ isPlaying: true });
    }
  },

  stopNote: function (ev) {
    if (this.state.isPlaying) {
      this.state.voice.pause();
      this.setState({ isPlaying: false });
    }
  }
});

export default Keyboard;
