let React = require('react');

let Track = React.createClass({
  componentDidMount: function () {
    let canvas = this.refs.canvas.getDOMNode();
    let ctx = canvas.getContext('2d');

    this.setState({
      ctx: ctx
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
                width="850"
                height="80">
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
      if (!note.endTime) {
        note.endTime = Number(new Date());
      }

      let x = note.startTime - timeZero;
      let y = 100 - note.midi;
      let width = (note.endTime - note.startTime) * 10;

      console.log(x, y, width);

      ctx.fillRect(x, y, width, rectHeight);
    }
  }
});

export default Track;
