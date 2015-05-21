import FileHandler from './file_handler';
import RenderSurface from './render_surface';
import TMX from './tmx';

document.addEventListener('DOMContentLoaded', function () {
  let renderSurface = new RenderSurface(document.getElementById('render'));
  let tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    let tmx = new TMX(this.result);
  };
});
