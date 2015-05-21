import DrawSurface from './draw_surface';
import FileHandler from './file_handler';

document.addEventListener('DOMContentLoaded', function () {
  let drawContainer = document.getElementById('tile-map');
  let drawSurface = new DrawSurface(drawContainer);

  let tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));
});
