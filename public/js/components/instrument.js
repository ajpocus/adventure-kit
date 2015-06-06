let React = require('react');

let Instrument = React.createClass({
  getInitialState: function () {
    return {
      instrument: [
        {
          frequency: 440,
          gain: 0.3,
          type: 'sawtooth'
        },
        {
          frequency: 880,
          gain: 0.5,
          type: 'sine'
        },
        {
          frequency: 1760,
          gain: 0.2,
          type: 'square'
        }
      ]
    };
  },

  render: function () {
    let instrument = this.state.instrument;
    let components = [];

    for (let i = 0; i < instrument.length; i++) {
      let wave = instrument[i];
      components.push(
        <li className="component"
            key={i}>
          <input type="number"
                 defaultValue={wave.frequency}
                 onChange={this.onFrequencyChange}/>
          <input type="slider"
                 defaultValue={wave.gain}
                 min="0"
                 max="1"
                 onChange={this.onGainChange}/>
          <select defaultValue={wave.type}
                  onChange={this.onTypeChange}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </li>
      );
    }

    return (
      <div className="instrument">
        <ul className="components">
          {components}
        </ul>
      </div>
    );
  },

  onFrequencyChange: function (ev) {
    console.log(ev.target);
  },

  onGainChange: function (ev) {},

  onTypeChange: function (ev) {}

});

export default Instrument;
