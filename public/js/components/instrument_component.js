let React = require('react');

let InstrumentComponent = React.createClass({
  render: function () {
    let instrument = this.props.instrument;
    let component = instrument.components[this.props.idx];

    return (
      <div className="component">
        <div className="field">
          <label htmlFor="harmonic">Harmonic</label>
          <input type="number"
                 name="harmonic"
                 value={component.harmonic}
                 onChange={this.onHarmonicChange}/>
        </div>

        <div className="field">
          <label htmlFor="gain">Gain</label>
          <input type="range"
                 name="gain"
                 value={component.gain}
                 min="0"
                 max="1"
                 step="0.01"
                 onChange={this.onGainChange}/>
          <input type="number"
                 name="gain"
                 value={parseFloat(component.gain).toFixed(2)}
                 min="0"
                 max="1"
                 onChange={this.onGainChange}/>
        </div>

        <div className="field">
          <label htmlFor="waveType">Wave type</label>
          <select name="waveType"
                  defaultValue={component.type}
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

  onHarmonicChange: function (ev) {
    instrument.components[this.props.idx].harmonic = ev.target.value;
    MusicActions.updateInstrument(instrument);
  },

  onGainChange: function (ev) {
    instrument.components[this.props.idx].gain = ev.target.value;
    MusicActions.updateInstrument(instrument);
  },

  onTypeChange: function (ev) {
    instrument.components[this.props.idx].type = ev.target.value;
    MusicActions.updateInstrument(instrument);
  }
});

export default InstrumentComponent;
