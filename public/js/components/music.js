let React = require('react');

import TrackList from './track_list';
import Instrument from './instrument';
import Keyboard from './keyboard';

let Music = React.createClass({
  getInitialState: function () {
    return {

    };
  },

  render: function () {
    return (
      <div id="music">
        <TrackList/>
        <Instrument onChange={this.onInstrumentChange}/>
        <Keyboard/>
      </div>
    );
  }
});

export default Music;
