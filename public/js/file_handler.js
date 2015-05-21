class FileHandler {
  constructor (el) {
    this.el = el;
    this.el.onchange = this.fileLoaded.bind(this);
  }

  fileLoaded (ev) {
    let file = this.el.files[0];
    let reader = new FileReader();

    reader.onload = this.onload || null;
    reader.readAsText(file);
  }
}

export default FileHandler;
