let React = require('react');

import InstrumentComponent from './instrument_component';

let NewInstrument = React.createClass({
  getInitialState: function () {
    return {
      components: [
        {
          octave: 0,
          gain: 0.5,
          type: 'sawtooth'
        }
      ]
    };
  },

  render: function () {
    let components = this.state.components;
    let componentViews = [];

    for (let i = 0; i < components.length; i++) {
      let wave = components[i];
      componentViews.push(
        <InstrumentComponent key={i}
                             idx={i}
                             frequency={wave.frequency}
                             gain={wave.gain}
                             type={wave.type}
                             onChange={this.onChange}/>
      );
    }

    return (
      <div className="instrument">
        <div className="components">
          {componentViews}
        </div>
      </div>
    );
  },

  onChange: function (newState, idx) {
    console.log(component, idx);

    let components = this.state.components;
    let component = components[idx];
    for (let prop in newState) {
      if (newState.hasOwnProperty(prop)) {
        component[prop] = newState[prop];
      }
    }

    components[idx] = component;
    this.setState({ components: components });
  }
});

export default NewInstrument;
