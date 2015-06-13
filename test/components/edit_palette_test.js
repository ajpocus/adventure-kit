require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var EditPalette = require('../../public/js/components/edit_palette');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;
var sinon = require('sinon');
var tinycolor = require('tinycolor2');

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

  it('adds a color', function () {
    var newColorBtn = document.querySelector('.new.color');
    var len = palette.length;
    TestUtils.Simulate.click(newColorBtn);

    expect(palette.length).to.equal(len + 1);
    expect(palette[len]).to.equal('#ffffff');

    var colors = document.querySelectorAll('.color');

    expect(colors.length).to.equal(palette.length + 1); // +1 for new color
  });

  it('removes a color', function () {
    var removeBtn = document.querySelector('.remove');
    var originalLen = palette.length;

    TestUtils.Simulate.click(removeBtn);
    expect(palette.length).to.equal(originalLen - 1);
  });

  it('sets the active color on click', function () {
    var secondColor = document.querySelectorAll('.color')[1];
    TestUtils.Simulate.click(secondColor);

    expect(editPalette.state.activePaletteColor).to.equal(palette[1]);
  });

  it('edits the active color', function () {
    var secondColor = document.querySelector('.color');
    var picker = editPalette.refs.paletteColor.getDOMNode();
    var newColor = '#beebee';

    TestUtils.Simulate.click(secondColor);
    TestUtils.Simulate.change(picker, {
      target: {
        value: newColor
      }
    });

    var colorSwatch = document.querySelector('.color .swatch');
    var bgColor = tinycolor(colorSwatch.style.background);
    expect(editPalette.state.activePaletteColor).to.equal(newColor);
    expect(bgColor.toHexString()).to.equal(newColor);
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
