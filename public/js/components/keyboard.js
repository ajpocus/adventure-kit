let React = require('react');
let T = require('timbre');

let keydict = T('ndict.key');
let midicps = T('midicps');

let synth = T('OscGen', {
  wave: 'saw',
  mul: 0.25
}).play();

let Keyboard = React.createClass({
  render: function () {
    return (
      <div id="keyboard"
           onKeyDown={this.playNote}
           onKeyUp={this.stopNote}>
      </div>
    );
  },

  playNote: function (ev) {
    let midi = keydict.at(ev.keyCode);
    if (!midi) {
      return;
    }

    let freq = midicps.at(midi);
    synth.noteOnWithFreq(freq);
  },

  stopNote: function (ev) {
    let midi = keydict.at(e.keyCode);
    if (!midi) {
      return;
    }

    synth.noteOff(midi);
  }
});

export default Keyboard;
