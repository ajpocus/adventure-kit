let React = require('react');

let InstrumentComponent = React.createClass({
  getDefaultProps: function () {
    return {
      frequency: 440,
      gain: 0.5,
      type: 'sine'
    }
  },

  getInitialState: function () {
    return {
      frequency: this.props.frequency,
      gain: this.props.gain,
      type: this.props.type
    };
  },

  render: function () {
    return (
      <div className="component">
        <div className="field">
          <label htmlFor="frequency">Frequency</label>
          <input type="number"
                 name="frequency"
                 value={this.state.frequency}
                 onChange={this.onFrequencyChange}/>
        </div>

        <div className="field">
          <label htmlFor="gain">Gain</label>
          <input type="range"
                 name="gain"
                 value={this.state.gain}
                 min="0"
                 max="1"
                 step="0.01"
                 onChange={this.onGainChange}/>
          <input type="number"
                 name="gain"
                 value={parseFloat(this.state.gain).toFixed(2)}
                 min="0"
                 max="1"
                 onChange={this.onGainChange}/>
        </div>

        <div className="field">
          <label htmlFor="waveType">Wave type</label>
          <select name="waveType"
                  defaultValue={this.state.type}
                  onChange={this.onTypeChange}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>
    );
  },

  onFrequencyChange: function (ev) {
    this.setState({ frequency: ev.target.value });
  },

  onGainChange: function (ev) {
    this.setState({ gain: ev.target.value });
  },

  onTypeChange: function (ev) {
    this.setState({ type: ev.target.value });
  }
});

export default InstrumentComponent;
