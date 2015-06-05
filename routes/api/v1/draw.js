var express = require('express');
var router = express.Router();
var fs = require('fs');
var PNG = require('pngjs').PNG;
var tinycolor = require('tinycolor2');

router.post('/png', function (req, res) {
  var grid = req.params.grid;
  var png = new PNG({
    width: grid.length,
    height: grid[0].length
  });

  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;
      var pixel = grid[x][y];
      if (!pixel.color) {
        pixel.color = 'rgba(0, 0, 0, 0)';
      }
      var color = tinycolor(pixel.color);
      var rgb = color.toRgb();
      var alpha = color.getAlpha() * 255;

      png.data[idx] = rgb.r;
      png.data[idx+1] = rgb.g;
      png.data[idx+2] = rgb.b;
      png.data[idx+3] = alpha;
    }
  }
  console.log(grid);
  res.sendFile(png.pack());
});

exports = module.exports = router;
