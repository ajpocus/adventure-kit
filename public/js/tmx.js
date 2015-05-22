function TMX (text) {
  this.text = text;
  var parser = new DOMParser();
  var tree = parser.parseFromString(this.text, "text/xml");
  window.tmx = tree;
  this.tree = {};

  var mapNode = this.tree.children[0];
  tree.map = {
    width: mapNode.getAttribute('width'),
    height: mapNode.getAttribute('height'),
    tilewidth: mapNode.getAttribute('tilewidth'),
    tileheight: mapNode.getAttribute('tileheight')
  };
}

exports = module.exports = TMX;
