let React = require('react');

let Keyboard = React.createClass({
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
  },

  render: function () {
    return (
      <div id="keyboard"
           onKeyDown={this.playNote}
           onKeyUp={this.stopNote}>
      </div>
    );
  },

  playNote: function (ev) {
    console.log('start');
    let oscillator = this.state.oscillator;
    oscillator.start();
  },

  stopNote: function (ev) {
    console.log('stop');
    this.state.oscillator.stop()
  }
});

export default Keyboard;
