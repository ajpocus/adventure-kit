var TMX = function (text) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, "text/xml");
  this.tree = {};

  var mapNode = doc.children[0];
  this.tree.map = TMX.objectFromAttributes(mapNode, [
    'width', 'height', 'tilewidth', 'tileheight'
  ]);

  var tilesetNodes = TMX.findChildrenByName(mapNode, 'tileset');
  this.tree.map.tilesets = [];
  for (var i = 0; i < tilesetNodes.length; i++) {
    var tilesetNode = tilesetNodes[i];
    this.tree.map.tilesets.push(
      TMX.objectFromAttributes(tilesetNode, [
        'firstgid', 'name', 'tilewidth', 'tileheight', 'spacing', 'margin'
      ])
    );
  }

  var layerNodes = TMX.findChildrenByName(mapNode, 'layer');
  this.tree.map.layers = [];
  for (i = 0; i < layerNodes.length; i++) {
    var layerNode = layerNodes[i];
    var layer = {
      data: []
    };

    var dataNodes = TMX.findChildrenByName(layerNode, 'data');
    for (var j = 0; j < dataNodes.length; j++) {
      var dataNode = dataNodes[j];
      for (var k = 0; k < dataNode.childElementCount; k++) {
        var tileNode = dataNode.children[k];
        var tile = TMX.objectFromAttributes(tileNode, ['gid']);
        layer.data.push(tile);
      }
    }

    this.tree.map.layers.push(layer);
  }
};

TMX.objectFromAttributes = function (node, attrs) {
  var obj = {};

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    obj[attr] = node.getAttribute(attr);
  }

  return obj;
};

TMX.findChildrenByName = function (node, name) {
  var children = [];
  for (var i = 0; i < node.childElementCount; i++) {
    var child = node.children[i];

    if (child.nodeName === name) {
      children.push(child);
    }
  }

  return children;
}
exports = module.exports = TMX;
