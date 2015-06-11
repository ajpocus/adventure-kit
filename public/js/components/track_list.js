let React = require('react');

let TrackList = React.createClass({
  componentDidMount: function () {
    let scratchCanvas = document.getElementById('scratch-canvas');
    let scratchCtx = scratchCanvas.getContext('2d');

    this.setState({
      scratchCanvas: scratchCanvas,
      scratchCtx: scratchCtx
    });
  },

  componentDidUpdate: function (prevProps, prevState) {
    this.drawScratch();
  },

  render: function () {
    return (
      <ul className="track-list">
        <li className="track"></li>
        <li className="track"></li>
        <li className="track"></li>
        <li className="track"></li>
        <li className="track scratch">
          <canvas id="scratch-canvas"
                  width="850"
                  height="80">
          </canvas>
        </li>
      </ul>
    );
  },

  drawScratch: function () {
    let recording = this.props.recording;
    let ctx = this.state.scratchCtx;

    console.log('rec len: ' + recording.length);

    if (!recording.length) {
      return;
    }

    let timeZero = recording[0].startTime;

    ctx.fillStyle = "#ffcc00";
    let rectHeight = 10;

    for (let i = 0; i < recording.length; i++) {
      let note = recording[i];
      if (!note.endTime) {
        note.endTime = Number(new Date());
      }

      let x = note.startTime - timeZero;
      let y = note.midi;
      let width = (note.endTime - note.startTime) * 10;

      console.log(x, y, width);

      ctx.fillRect(x, y, width, rectHeight);
    }
  }
});

export default TrackList;
