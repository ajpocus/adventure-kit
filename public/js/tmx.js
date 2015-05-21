class TMX {
  constructor (text) {
    this.text = text;
    let parser = new DOMParser();
    let tree = parser.parseFromString(this.text, "text/xml");
    window.tmx = tree;
    this.tree = {};

    let mapNode = this.tree.children[0];
    tree.map = {
      width: mapNode.getAttribute('width'),
      height: mapNode.getAttribute('height'),
      tilewidth: mapNode.getAttribute('tilewidth'),
      tileheight: mapNode.getAttribute('tileheight')
    };


  }
}

export default TMX;
