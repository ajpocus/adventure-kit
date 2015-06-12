require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var EditPalette = require('../../public/js/components/edit_palette');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');

describe('EditPalette', function () {
  var palette;
  var name;
  var onPaletteChange;
  var editPalette;

  beforeEach(function () {
    palette = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffffff',
      '#000000'
    ];

    name = 'Foobar Palette';
    onPaletteChange = sinon.spy();
    editPalette = React.render(
      <EditPalette palette={palette}
                   name={name}
                   onPaletteChange={onPaletteChange}/>,
      document.body
    );
  });

  it('should add a color', function () {
    var newColorBtn = document.querySelector('.new.color');
    var len = palette.length;
    TestUtils.Simulate.click(newColorBtn);

    assert.equal(palette.length, len + 1);
    assert.equal(palette[len], '#ffffff');

    var colors = document.querySelectorAll('.color');

    assert.equal(colors.length, palette.length + 1); // +1 for new color button
  });

  it('should remove a color', function () {
    var removeBtn = document.querySelector('.remove');
    var len = palette.length;

    TestUtils.Simulate.click(removeBtn);
    assert.equal(palette.length, len - 1);
  });

  it('should set the active color on click', function () {
    var secondColor = document.querySelectorAll('.color')[1];
    TestUtils.Simulate.click(secondColor);

    assert.equal(editPalette.state.activePaletteColor, palette[1]);
  });

  it('should edit an existing color');

  it('should cancel the palette changes on Cancel click');

  it('should save the palette changes on Save click');

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
