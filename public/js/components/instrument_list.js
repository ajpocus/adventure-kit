let React = require('react');

import EditInstrument from './edit_instrument';

let InstrumentList = React.createClass({
  getInitialState: function () {
    return {
      instruments: this.props.instruments,
      activeInstrument: this.props.activeInstrument
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state !== prevState) {
      this.props.onUpdate(this.state);
    }
  },

  render: function () {
    let instruments = this.state.instruments;
    let instrumentViews = [];

    for (let i = 0; i < instruments.length; i++) {
      let instrument = instruments[i];
      let className = 'instrument';
      if (i === this.state.activeInstrument) {
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
    this.setState({ activeInstrument: idx });
  },

  newInstrument: function () {
    let instruments = this.state.instruments;
    let name = 'New Instrument';
    instruments.push({ name: name });
    let idx = instruments.length - 1;
    let activeInstrument = idx;

    React.render(<EditInstrument onInstrumentChange={this.onInstrumentChange}/>,
                 document.getElementById('modal-container'));

    this.setState({
      instruments: instruments,
      activeInstrument: idx
    });
  },

  onInstrumentChange: function (instrument) {
    let instruments = this.state.instruments;
    let activeInstrument = this.state.activeInstrument;
    instruments[activeInstrument] = instrument;

    this.setState({
      instruments: instruments
    });

    this.props.onUpdate(this.state);
  }
});

export default InstrumentList;
