document.addEventListener("DOMContentLoaded", function () {
  var WIDTH = 640;
  var HEIGHT = 480;

  var renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  document.getElementById('root').appendChild(renderer.view);

  var stage = new PIXI.Container();

  var heroTexture = PIXI.Texture.fromImage("/img/hero.png");
  var hero = new PIXI.Sprite(heroTexture);

  requestAnimationFrame(animate);

  function animate () {
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
});
