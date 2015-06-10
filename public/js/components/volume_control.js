let React = require('react');

let VolumeControl = React.createClass({
  getDefaultProps: function () {
    return {
      volume: 0.5
    };
  },

  getInitialState: function () {
    return {
      volume: this.props.volume
    };
  },

  render: function () {
    return (
      <div className="volume control">
        <img className="icon"
             src="/img/icons/glyphicons-184-volume-down.png"/>
        <input type="range"
               min="0"
               max="1"
               step="0.01"
               value={this.state.volume}
               onChange={this.handleChange}/>
        <img className="icon"
             src="/img/icons/glyphicons-185-volume-up.png"/>
        <span className="display">{Math.round(this.state.volume * 100)}</span>
      </div>
    );
  },

  handleChange: function (ev) {
    let volume = ev.target.value;
    this.setState({ volume: volume });
    this.props.onVolumeChange(volume);
  }
});

export default VolumeControl;
