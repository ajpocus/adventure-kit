let React = require('react');
let $ = require('jquery');

let Keyboard = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  componentDidMount: function () {
    let synth = new Beep.Instrument();
    console.log(synth);

    this.setState({
      synth: synth
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
        <div id="beep">
          <div className="instrument"></div>
        </div>
      </div>
    );
  },

  playNote: function (ev) {

  },

  stopNote: function (ev) {

  }
});

export default Keyboard;
