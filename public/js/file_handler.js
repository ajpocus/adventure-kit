var FileHandler = function (el) {
  this.el = el;
  this.el.onchange = this.fileLoaded.bind(this);
}

FileHandler.prototype.fileLoaded = function (ev) {
  var file = this.el.files[0];
  var reader = new FileReader();

  reader.onload = this.onload || null;
  reader.readAsText(file);
};

exports = module.exports = FileHandler;
