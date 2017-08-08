let React = require('react');

import MusicActions from '../actions/music_actions';
import Modal from './modal';
import EditInstrument from './edit_instrument';

class InstrumentList extends React.Component {
  render() {
    let instruments = this.props.instruments;
    let instrumentViews = [];

    for (let i = 0; i < instruments.length; i++) {
      let instrument = instruments[i];
      let className = 'instrument';
      if (i === this.props.activeInstrument) {
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

    let activeInstrument = instruments[this.props.activeInstrument];

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

        <Modal isOpen={this.props.isEditingInstrument}>
          <EditInstrument instrument={activeInstrument}/>
        </Modal>
      </div>
    );
  }

  handleClick(idx) {
    MusicActions.setActiveInstrument(idx);
  }

  newInstrument() {
    MusicActions.newInstrument();
  }
};

export default InstrumentList;
