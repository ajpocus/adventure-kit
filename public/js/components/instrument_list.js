let React = require('react');

import EditInstrument from './edit_instrument';

let InstrumentList = React.createClass({
  getInitialState: function () {
    return {
      instruments: [ this.props.activeInstrument ],
      activeInstrument: this.props.activeInstrument
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.activeInstrument !== this.state.activeInstrument) {
      this.props.onInstrumentChange(this.state.activeInstrument);
    }
  },

  render: function () {
    let instruments = this.state.instruments;
    let instrumentViews = [];

    for (let i = 0; i < instruments.length; i++) {
      let instrument = instruments[i];
      let className = 'instrument';
      if (instrument === this.state.activeInstrument) {
        className += ' active';
      }

      instrumentViews.push(
        <li className={className}
            key={i}
            onClick={this.handleClick.bind(this, i)}>
            <span className="name">{instrument.name}</span>
        </li>
      );
    }

    return (
      <div className="instrument-list">
        <h2>Instruments</h2>
        <button className="new-instrument"
                onClick={this.newInstrument}>
          + New Instrument
        </button>
        <ul className="instrument-list">
          {instrumentViews}
        </ul>
      </div>

    );
  },

  handleClick: function (idx) {
    let instrument = this.state.instruments[idx];
    this.setState({ activeInstrument: instrument });
  },

  newInstrument: function () {
    React.render(<EditInstrument onInstrumentChange={this.onInstrumentChange}
                                 onInstrumentSave={this.onInstrumentSave}/>,
                 document.getElementById('modal-container'));
  }
});

export default InstrumentList;
