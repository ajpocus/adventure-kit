let React = require('react');
let tinycolor = require('tinycolor2');

import TrackToolList from './track_tool_list';
import ContextMenu from './context_menu';

let Track = React.createClass({
  getDefaultProps: function () {
    let bpm = 120;
    let numMeasures = 4;
    let beatsPerMeasure = 4;

    let beatsPerSecond = bpm / 60;
    let msPerBeat = 1000 / beatsPerSecond;
    let beatsPerWidth = beatsPerMeasure * numMeasures;
    let msPerWidth = msPerBeat * beatsPerWidth;

    return {
      noteHeight: 8,
      noteColor: '#ffcc00',
      canvasWidth: 850,
      canvasHeight: 96,
      bpm,
      numMeasures,
      beatsPerMeasure,
      beatsPerSecond,
      msPerBeat,
      beatsPerWidth,
      msPerWidth,
      contextOptions: [
        'Cut',
        'Copy',
        'Paste'
      ]
    };
  },

  getInitialState: function () {
    return {
      isRecording: this.props.isRecording,
      isPlaying: false,
      isPaused: false,
      isMouseDown: false,
      noteSelected: false,
      trackSelected: false,
      isSelectingTrack: false
    };
  },

  componentDidMount: function () {
    let width = this.props.canvasWidth;
    let height = this.props.canvasHeight;
    let renderer = PIXI.autoDetectRenderer(width, height, {
      backgroundColor: 0x565556
    });
    this.getDOMNode().appendChild(renderer.view);

    let stage = new PIXI.Container();
    let gfx = new PIXI.Graphics();
    stage.addChild(gfx);

    this.setState({
      renderer,
      stage,
      gfx
    }, function () {
      this.drawMeasureMarkers();
      renderer.render(stage);
      requestAnimationFrame(this.draw);
    });
  },

  componentDidUpdate: function () {
    requestAnimationFrame(this.draw);

    if (this.state.isPaused && this.state.isRecording ||
        this.state.isPaused && this.state.isPlaying) {
      this.setState({
        isRecording: false,
        isPlaying: false
      });
    }
  },

  render: function () {
    return (
      <li className="track"
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onContextMenu={this.handleContextMenu}>
        <div className="track-controls">
          <TrackToolList onSetActiveTool={this.handleSetActiveTool}/>
        </div>
      </li>
    );
  },

  draw: function () {
    let data = this.props.data;
    let gfx = this.state.gfx;
    let renderer = this.state.renderer;
    let stage = this.state.stage;

    if (!data || !data.length) {
      return;
    }

    let [startBound, endBound] = this.getTrackBounds();

    gfx.clear();
    this.drawMeasureMarkers();
    gfx.beginFill(0xffcc00);

    for (let i = 0; i < data.length; i++) {
      let note = data[i];
      let { x, y, width, height } = this.getNoteBounds(note, startBound, endBound);
      gfx.drawRect(x, y, width, height);
    }

    renderer.render(stage);
    requestAnimationFrame(this.draw);
  },

  getTrackBounds: function () {
    let data = this.props.data;

    if (!data || !data.length) {
      return;
    }

    let startBound = data[0].startTime;
    let endBound = Number(new Date());
    let boundTime = endBound - startBound;

    if (boundTime < this.props.msPerWidth) {
      endBound = startBound + this.props.msPerWidth;
    } else {
      endBound = this.state.endBound || Number(new Date());
      startBound = endBound - this.props.msPerWidth;
    }

    return [startBound, endBound];
  },

  getNoteBounds: function (note, startBound, endBound) {
    if (!startBound && !endBound) {
      endBound = Number(new Date());
      startBound = endBound - this.props.msPerWidth;
    } else if (!startBound) {
      startBound = endBound - this.props.msPerWidth;
    } else if (!endBound) {
      endBound = startBound + this.props.msPerWidth;
    }

    let startTime = note.startTime - startBound;
    let endTime = (note.endTime || Number(new Date())) - startBound;
    let midi = note.midi;
    let factor = midi % 12;
    let noteMs = (note.endTime || Number(new Date())) - note.startTime;

    let width = (noteMs / this.props.msPerWidth) * this.props.canvasWidth;
    let height = this.props.noteHeight;
    let x = (startTime / this.props.msPerWidth) * this.props.canvasWidth;
    let y = this.props.canvasHeight - (factor * height + height);

    return { x, y, width, height };
  },

  drawMeasureMarkers: function () {
    let gfx = this.state.gfx;
    gfx.beginFill(0x000000, 0.2);

    let halfX = this.props.canvasWidth / 2;
    let y = 0;
    let width = 1;
    let height = this.props.canvasHeight;
    gfx.drawRect(halfX, y, width, height);

    let quarterX = this.props.canvasWidth / 4;
    gfx.drawRect(quarterX, y, width, height);

    let threeX = this.props.canvasWidth * 3 / 4;
    gfx.drawRect(threeX, y, width, height);
  },

  handleSetActiveTool: function (name) {
    let isRecording = this.state.isRecording;
    let isPlaying = this.state.isPlaying;
    let isPaused = this.state.isPaused;
    let endBound = this.state.endBound;

    switch (name) {
      case 'Play':
        // stop recording, set the marker to 0, and play the recording
        isRecording = false;
        break;

      case 'Pause':
        // pause the track recording / playback
        isPaused = !isPaused;
        isPlaying = false;
        isRecording = false;
        endBound = Number(new Date());
        break;

      default:
        return;
    }

    this.setState({
      activeTool: name,
      isPaused,
      endBound
    });
  },

  handleClick: function (ev) {
    if (this.mouseOverNote(ev)) {
      this.selectNote(ev);
    }
  },

  handleMouseDown: function (ev) {
    this.setState({ isMouseDown: true });
  },

  handleMouseUp: function (ev) {
    this.setState({ isMouseDown: false });
  },

  handleMouseMove: function (ev) {
    if (this.state.isMouseDown) {
      if (this.state.noteSelected) {
        this.moveNote(ev);
      } else if (this.state.trackSelected) {
        this.moveTrackSelection(ev);
      }
    }
  },

  handleContextMenu: function (ev) {
    ev.preventDefault();
    React.render(<ContextMenu options={this.props.contextOptions}
                              onOptionSelected={this.onOptionSelected}
                              ev={ev}/>,
                 document.getElementById('context-menu-container'));
  },

  moveNote: function (ev) {

  },

  moveTrackSelection: function (ev) {

  },

  mouseOverNote: function (ev) {
    let pos = this.getCanvasPosition(ev);
    let activeNote = null;
    let data = this.state.data;

    if (!data || !data.length) {
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      let note = data[i];
      let [startBound, endBound] = this.getTrackBounds();
      let { x, y, width, height } = this.getNoteBounds(note, startBound, endBound);
      let endX = width - x;
      let endY = height - y;

      if (pos.x > x && pos.x < endX && pos.y > y && pos.y < endY) {
        activeNote = i;
      }
    }

    this.setState({
      activeNote
    });

    return Boolean(activeNote);
  },

  getCanvasPosition: function (ev) {
    let rect = this.state.stage.getBounds();
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };
  },

  onOptionSelected: function (name) {
    // TODO: do something with selected option
  }
});

export default Track;
