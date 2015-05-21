import DrawSurface from './draw_surface';

document.addEventListener('DOMContentLoaded', function () {
  let drawContainer = document.getElementById('draw');
  let drawSurface = new DrawSurface(drawContainer);

  let tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));
});
