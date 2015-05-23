exports = module.exports = function () {
  if (!Element.prototype.addClass) {
    Element.prototype.addClass = function (className) {
      if (this.classList) {
        this.classList.add(className);
        return this.classList;
      } else {
        this.className += ' ' + className;
        return this.className.split(' ');
      }
    };
  }

  if (!Element.prototype.hasClass) {
    Element.prototype.hasClass = function (className) {
      if (this.classList) {
        return this.classList.contains(className);
      } else {
        return new RegExp('(^| )' +
                          className +
                          '( |$)', 'gi'
                         ).test(this.className);
      }
    };
  }

  if (!Element.prototype.removeClass) {
    Element.prototype.removeClass = function (className) {
      if (this.classList) {
        this.classList.remove(className);
        return this.classList;
      } else {
        this.className = this.className.replace(
          new RegExp('(^|\\b)' +
                     className.split(' ').join('|') +
                     '(\\b|$)', 'gi'
                    ),
          ' ');
        return this.className.split(' ');
      }
    };
  }
};
