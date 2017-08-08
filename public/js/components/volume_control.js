let React = require('react');
import PropTypes from 'prop-types';

class VolumeControl extends React.Component {
  getInitialState() {
    return {
      volume: this.props.volume
    };
  }

  render() {
    return (
      <div className="volume control">
        <img className="volume icon"
             src="/img/icons/glyphicons-184-volume-down.png"/>
        <input type="range"
               min="0"
               max="1"
               step="0.01"
               value={this.state.volume}
               onChange={this.handleChange}/>
        <img className="volume icon"
             src="/img/icons/glyphicons-185-volume-up.png"/>
        <span className="display">{Math.round(this.state.volume * 100)}</span>
      </div>
    );
  }

  handleChange(ev) {
    let volume = ev.target.value;
    this.setState({ volume: volume });
    this.props.onVolumeChange(volume);
  }
};

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired  
}

export default VolumeControl;
