let React = require('react');

let TrackList = React.createClass({
  render: function () {
    return (
      <ul className="track-list">
        <li className="track"></li>
        <li className="track"></li>
        <li className="track"></li>
        <li className="track"></li>
        <li className="track scratch">
        </li>
      </ul>
    );
  }
});

export default TrackList;
