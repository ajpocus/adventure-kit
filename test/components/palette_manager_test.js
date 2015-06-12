require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var PaletteManager = require('../../public/js/components/palette_manager');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');

describe('PaletteManager', function () {
  var onPrimaryColorChange;
  var onSecondaryColorChange;
  var paletteManager;
  var activePalette;
  var palette;
  var color;

  beforeEach(function () {
    onPrimaryColorChange = sinon.spy();
    onSecondaryColorChange = sinon.spy();

    paletteManager = React.render(
      <PaletteManager onPrimaryColorChange={onPrimaryColorChange}
                      onSecondaryColorChange={onSecondaryColorChange}
                      isEditingPalette={false}/>,
      document.body
    );

    activePalette = 'Rainbow';
    palette = paletteManager.state.palettes[activePalette];
    color = palette[0];
  });

  it('changes the primary color on click', function () {
    assert.equal(paletteManager.state.activePalette, activePalette);
    var colorNode = TestUtils.scryRenderedDOMComponentsWithClass(
      paletteManager, 'color')[0];

    TestUtils.Simulate.click(colorNode);

    assert.equal(onPrimaryColorChange.called, true);
    assert.equal(onPrimaryColorChange.calledWith(color), true);
  });

  it('allows the user to create a new palette', function () {
    // NOTE: jsdom doesn't implement window.prompt as of 2015/06/12
  });

  it('shows an EditPalette window on click', function () {
    var editButton = document.querySelector('.edit-palette.btn');
    TestUtils.Simulate.click(editButton);
    assert.equal(paletteManager.state.isEditingPalette, true);
    var editPalette = document.querySelector('.edit-palette.modal');
    assert.ok(editPalette);
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
