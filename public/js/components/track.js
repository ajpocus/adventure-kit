let React = require('react');
let tinycolor = require('tinycolor2');

import MusicActions from '../actions/music_actions';
import TrackToolList from './track_tool_list';
import ContextMenu from './context_menu';

class Track extends React.Component {
  getDefaultProps() {
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
      contextOptions: [
        'Cut',
        'Copy',
        'Paste'
      ],
      bpm,
      numMeasures,
      beatsPerMeasure,
      beatsPerSecond,
      msPerBeat,
      beatsPerWidth,
      msPerWidth
    };
  }

  componentDidMount() {
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
      stage
    }, function () {
      this.drawMeasureMarkers(gfx);
      renderer.render(stage);
      requestAnimationFrame(this.draw);
    });
  }

  componentDidUpdate() {
    requestAnimationFrame(this.draw);
  }

  render() {
    let trackState = this.props.trackState;
    let trackTools;
    if (this.props.isControllable) {
      trackTools = (
        <div className="track-controls">
          <TrackToolList activeTool={trackState.activeTool}
                         onSetActiveTool={this.handleSetActiveTool}/>
        </div>
      );
    }

    return (
      <li className="track"
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onContextMenu={this.handleContextMenu}>
        {trackTools}
      </li>
    );
  }

  draw() {
    let renderer = this.state.renderer;
    let stage = this.state.stage;
    let data = this.props.data;
    let gfx = stage.getChildAt(0);

    if (!data || !data.length) {
      return;
    }

    stage.removeChild(gfx);
    gfx = new PIXI.Graphics();

    let [startBound, endBound] = this.getTrackBounds();

    gfx.clear();
    this.drawMeasureMarkers(gfx);
    gfx.beginFill(0xffcc00);

    let lastIdx = data.length - 1;
    for (let i = lastIdx; i >= 0; i--) {
      let note = data[i];
      let { x, y, width, height } = this.getNoteBounds(note, startBound, endBound);
      if (note.endTime < startBound) {
        break;
      }

      gfx.drawRect(x, y, width, height);
    }

    stage.addChild(gfx);
    renderer.render(stage);
    requestAnimationFrame(this.draw);
  }

  getTrackBounds() {
    let data = this.props.data;
    let trackState = this.props.trackState;

    if (!data || !data.length) {
      return;
    }

    let lastIdx = data.length - 1;
    let startBound = data[0].startTime;
    let endBound = data[lastIdx].endTime || Number(new Date());
    let boundTime = endBound - startBound;

    if (boundTime < this.props.msPerWidth) {
      startBound = data[0].startTime;
      endBound = startBound + this.props.msPerWidth;
    } else {
      startBound = endBound - this.props.msPerWidth;
    }

    return [startBound, endBound];
  }

  getNoteBounds(note, startBound, endBound) {
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
    let noteMs = endTime - startTime;

    let width = (noteMs / this.props.msPerWidth) * this.props.canvasWidth;
    let height = this.props.noteHeight;
    let x = (startTime / this.props.msPerWidth) * this.props.canvasWidth;
    let y = this.props.canvasHeight - (factor * height + height);

    return { x, y, width, height };
  }

  drawMeasureMarkers(gfx) {
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
  }

  handleSetActiveTool(name) {
    let trackNumber = this.props.trackNumber;

    switch (name) {
      case 'Play':
        MusicActions.playTrack(trackNumber);
        break;

      case 'Pause':
        MusicActions.pauseTrack(trackNumber);
        break;

      default:
        return;
    }
  }

  handleClick(ev) {
    if (this.mouseOverNote(ev)) {
      this.selectNote(ev);
    }

    if (this.props.isControllable) {
      MusicActions.pauseTrack(this.props.trackNumber);
    }
  }  

  handleMouseDown(ev) {
    MusicActions.setIsMouseDown(true);
  }

  handleMouseUp(ev) {
    MusicActions.setIsMouseDown(false);
  }

  handleMouseMove(ev) {
    if (this.state.isMouseDown) {
      if (this.state.noteSelected) {
        this.moveNote(ev);
      } else if (this.state.trackSelected) {
        this.moveTrackSelection(ev);
      }
    }
  }

  handleContextMenu(ev) {
    ev.preventDefault();
    React.render(<ContextMenu options={this.props.contextOptions}
                              onOptionSelected={this.onOptionSelected}
                              ev={ev}/>,
                 document.getElementById('context-menu-container'));
  }

  moveNote(ev) {

  }

  moveTrackSelection(ev) {

  }

  mouseOverNote(ev) {
    let pos = this.getCanvasPosition(ev);
    let activeNote = null;
    let data = this.props.data;

    if (!data || !data.length) {
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      let note = data[i];
      let [startBound, endBound] = this.getTrackBounds();
      let { x, y, width, height } = this.getNoteBounds(note, startBound, endBound);
      let endX = x + width;
      let endY = y + height;

      if (pos.x > x && pos.x < endX && pos.y > y && pos.y < endY) {
        activeNote = i;
      }
    }

    this.setState({
      activeNote
    });

    return Boolean(activeNote);
  }

  getCanvasPosition(ev) {
    let rect = this.state.renderer.view.getBoundingClientRect();
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };
  }

  onOptionSelected(name) {
    // TODO: do something with selected option
  }
};

export default Track;
