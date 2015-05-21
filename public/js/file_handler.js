class FileHandler {
  constructor (el) {
    this.el = el;
    this.el.addEventListener('onchange', this.fileLoaded.bind(this), false);
  }

  fileLoaded (ev) {
    console.log(ev);
    let file = el.files[0];
    this.reader = new FileReader();

    reader.onload = this.onload || null;
    reader.readAsText(file);
  }
}

export default FileHandler;
