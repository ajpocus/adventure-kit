let React = require('react');

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
      <ul className="instrument-list">
        <h2>Instruments</h2>
        {instrumentViews}
      </ul>
    );
  },

  handleClick: function (idx) {
    let instrument = this.state.instruments[idx];
    this.setState({ activeInstrument: instrument });
  }
});

export default InstrumentList;
