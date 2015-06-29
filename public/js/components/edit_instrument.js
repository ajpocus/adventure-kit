let React = require('react');

import MusicActions from '../actions/music_actions';
import InstrumentComponent from './instrument_component';

let EditInstrument = React.createClass({
  render: function () {
    let instrument = this.props.instrument;
    let components = instrument.components;
    let componentViews = [];

    for (let i = 0; i < components.length; i++) {
      let wave = components[i];
      componentViews.push(
        <InstrumentComponent instrument={instrument}
                             key={wave.key}
                             idx={i}/>
      );
    }

    return (
      <div className="edit-instrument modal">
        <div className="modal-background">
          <div className="modal-content">
            <div className="header">
              <h3>Edit Instrument</h3>
              <span className="close-modal"
                    onClick={this.handleCancel}>
                    x
              </span>
            </div>

            <div className="content">
              <div className="instrument">
                <input name="name"
                       value={instrument.name}
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

            <div className="footer btn">
              <button className="cancel"
                      onClick={this.handleCancel}>
                Cancel
              </button>

              <button className="save btn"
                      onClick={this.handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleNameChange: function (ev) {
    let instrument = this.props.instrument;
    instrument.name = ev.target.value;
    MusicActions.updateInstrument(instrument);
  },

  addUndertone: function () {
    let instrument = this.props.instrument;
    let components = instrument.components;
    let firstComponent = components[0];
    let harmonic = firstComponent.harmonic - 1;
    let key = firstComponent.key - 1;

    components.unshift({
      harmonic,
      gain: 0.5,
      type: 'square',
      key
    });

    instrument.components = components;
    MusicActions.updateInstrument(instrument);
  },

  addOvertone: function () {
    let instrument = this.props.instrument;
    let components = instrument.components;
    let lastComponent = components[components.length - 1];
    let harmonic = lastComponent.harmonic + 1;
    let key = lastComponent.key + 1;

    components.push({
      harmonic,
      gain: 0.5,
      type: 'square',
      key
    });

    instrument.components = components;
    MusicActions.updateInstrument(instrument);
  },

  handleClose: function () {
    MusicActions.closeEditInstrument();
  },

  handleCancel: function () {
    // remove the created instrument
    this.handleClose();
  },

  handleSave: function () {
    // save the instrument
    this.handleClose();
  }
});

export default EditInstrument;
