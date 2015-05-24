class TMX {
  constructor (text) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/xml");
    this.tree = {};

    let mapNode = doc.children[0];
    this.tree.map = TMX.objectFromAttributes(mapNode, [
      'width', 'height', 'tilewidth', 'tileheight'
    ]);

    let tilesetNodes = TMX.findChildrenByName(mapNode, 'tileset');
    this.tree.map.tilesets = [];
    for (let i = 0; i < tilesetNodes.length; i++) {
      let tilesetNode = tilesetNodes[i];
      this.tree.map.tilesets.push(
        TMX.objectFromAttributes(tilesetNode, [
          'firstgid', 'name', 'tilewidth', 'tileheight', 'spacing', 'margin'
        ])
      );
    }

    let layerNodes = TMX.findChildrenByName(mapNode, 'layer');
    this.tree.map.layers = [];
    for (i = 0; i < layerNodes.length; i++) {
      let layerNode = layerNodes[i];
      let layer = {
        data: []
      };

      let dataNodes = TMX.findChildrenByName(layerNode, 'data');
      for (let j = 0; j < dataNodes.length; j++) {
        let dataNode = dataNodes[j];
        for (let k = 0; k < dataNode.childElementCount; k++) {
          let tileNode = dataNode.children[k];
          let tile = TMX.objectFromAttributes(tileNode, ['gid']);
          layer.data.push(tile);
        }
      }

      this.tree.map.layers.push(layer);
    }
  }

  objectFromAttributes (node, attrs) {
    let obj = {};

    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      obj[attr] = node.getAttribute(attr);
    }

    return obj;
  }

  findChildrenByName (node, name) {
    let children = [];
    for (let i = 0; i < node.childElementCount; i++) {
      let child = node.children[i];

      if (child.nodeName === name) {
        children.push(child);
      }
    }

    return children;
  }
}

export default TMX;
