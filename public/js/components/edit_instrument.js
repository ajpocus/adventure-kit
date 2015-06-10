let React = require('react');

import InstrumentComponent from './instrument_component';

let EditInstrument = React.createClass({
  getInitialState: function () {
    return {
      name: 'New Instrument',
      components: [
        {
          harmonic: 0,
          gain: 0.5,
          type: 'sawtooth',
          key: Math.random()
        }
      ]
    };
  },

  componentDidMount: function () {
    this.props.onInstrumentChange(this.state);
  },

  render: function () {
    let components = this.state.components;
    let componentViews = [];

    for (let i = 0; i < components.length; i++) {
      let wave = components[i];
      console.log(wave);
      componentViews.push(
        <InstrumentComponent key={wave.key}
                             idx={i}
                             harmonic={wave.harmonic}
                             gain={wave.gain}
                             type={wave.type}
                             onChange={this.handleChange}/>
      );
    }

    return (
      <div className="edit-instrument modal">
        <div className="modal-background">
          <div className="modal-content">
            <div className="header">
              <h3>Edit Instrument</h3>
              <span className="close-modal"
                    onClick={this.close}>
                    x
              </span>
            </div>

            <div className="content">
              <div className="instrument">
                <input name="name"
                       value={this.state.name}
                       onChange={this.handleNameChange}/>
                <div className="components">
                  <button className="new-component undertone"
                          onClick={this.addUndertone}>
                    +
                  </button>

                  {componentViews}

                  <button className="new-component overtone"
                          onClick={this.addOvertone}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleChange: function (newState, idx) {
    console.log(newState, idx);
    let components = this.state.components;
    let component = components[idx];
    for (let prop in newState) {
      if (newState.hasOwnProperty(prop)) {
        component[prop] = newState[prop];
      }
    }

    components[idx] = component;
    this.setState({ components: components }, function () {
      this.props.onInstrumentChange(this.state);
    });
  },

  handleNameChange: function (ev) {
    this.setState({
      name: ev.target.value
    }, function () {
      this.props.onInstrumentChange(this.state);
    });
  },

  addUndertone: function () {
    let components = this.state.components;
    let firstComponent = components[0];
    let harmonic = firstComponent.harmonic - 1;
    let key = Math.random();

    components.unshift({
      harmonic: harmonic,
      gain: 0.5,
      type: 'square',
      key: key
    });

    this.setState({ components: components });
  },

  addOvertone: function () {
    let components = this.state.components;
    let lastComponent = components[components.length - 1];
    let harmonic = lastComponent.harmonic + 1;
    let key = Math.random();

    components.push({
      harmonic: harmonic,
      gain: 0.5,
      type: 'square',
      key: key
    });

    this.setState({ components: components });
  },

  close: function () {
    React.unmountComponentAtNode(document.getElementById('modal-container'));
  }
});

export default EditInstrument;
