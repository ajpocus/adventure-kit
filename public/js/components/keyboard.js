let React = require('react');
let $ = require('jquery');

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  componentDidMount: function () {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 3000;
    gain.gain.value = 0.5;

    oscillator.connect(gain);
    gain.connect(context.destination);

    this.setState({
      context: context,
      oscillator: oscillator,
      gain: gain
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
      this.state.oscillator.start();
      this.setState({ isPlaying: true });
    }
  },

  stopNote: function (ev) {
    if (this.state.isPlaying) {
      this.state.oscillator.stop();
      this.setState({ isPlaying: false });
    }
  }
});

export default Keyboard;
