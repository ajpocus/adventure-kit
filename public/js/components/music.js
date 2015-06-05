let React = require('react');

import TrackList from './track_list';
import Keyboard from './keyboard';

let Music = React.createClass({
  render: function () {
    return (
      <div id="music">
        <TrackList/>
        <Keyboard/>
      </div>
    );
  }
});

export default Music;
