let React = require('react');
let tinycolor = require('tinycolor2');

let Track = React.createClass({
  getDefaultProps: function () {
    return {
      noteHeight: 8,
      noteColor: '#ffcc00',
      canvasWidth: 850,
      canvasHeight: 96
    };
  },

  componentDidMount: function () {
    let canvas = this.refs.canvas.getDOMNode();
    let ctx = canvas.getContext('2d');

    this.setState({
      ctx: ctx
    }, function () {
      this.drawMeasureMarkers();
      this.draw();
    });
  },

  componentDidUpdate: function () {
    this.draw();
  },

  render: function () {
    return (
      <li className="track">
        <canvas className="track-canvas"
                ref="canvas"
                width={this.props.canvasWidth}
                height={this.props.canvasHeight}>
        </canvas>
      </li>
    );
  },

  draw: function () {
    let data = this.props.data;
    let ctx = this.state.ctx;

    if (!data || !data.length) {
      return;
    }

    let timeZero = data[0].startTime;

    ctx.fillStyle = "#ffcc00";
    let rectHeight = 10;

    for (let i = 0; i < data.length; i++) {
      let note = data[i];
      let { x, y, width, height } = this.getNoteParams(note, timeZero);

      ctx.fillRect(x, y, width, height);
    }

    requestAnimationFrame(this.draw);
  },

  getNoteParams: function (note, startBound, endBound) {
    let bpm = 120;
    let numMeasures = 4;
    let beatsPerMeasure = 4;

    let beatsPerSecond = bpm / 60;
    let msPerBeat = 1000 / beatsPerSecond;
    let beatsPerWidth = beatsPerMeasure * numMeasures;
    let msPerWidth = msPerBeat * beatsPerWidth;

    if (!startBound && !endBound) {
      endBound = Number(new Date());
      startBound = endBound - msPerWidth;
    } else if (!startBound) {
      startBound = endBound - msPerWidth;
    } else if (!endBound) {
      endBound = startBound + msPerWidth;
    }

    if (!note.endTime) {
      note.endTime = Number(new Date());
    }

    let startTime = note.startTime - startBound;
    let endTime = note.endTime - startBound;
    let midi = note.midi;
    let factor = midi % 12;

    let noteMs = note.endTime - note.startTime;
    let noteBeats = noteMs / msPerBeat;

    let height = this.props.noteHeight;
    let width = (noteBeats / beatsPerWidth) * this.props.canvasWidth;
    let x = (startTime / msPerWidth) * this.props.canvasWidth;
    let y = this.props.canvasHeight - (factor * height);

    return { x, y, width, height };
  },

  drawMeasureMarkers: function () {
    let ctx = this.state.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'

    let halfX = this.props.canvasWidth / 2;
    let y = 0;
    let width = 1;
    let height = this.props.canvasHeight;
    ctx.fillRect(halfX, y, width, height);

    let quarterX = this.props.canvasWidth / 4;
    ctx.fillRect(quarterX, y, width, height);

    let threeX = this.props.canvasWidth * 3 / 4;
    ctx.fillRect(threeX, y, width, height);
  }
});

export default Track;
