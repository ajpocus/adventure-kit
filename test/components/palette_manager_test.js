require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var PaletteManager = require('../../public/js/components/palette_manager');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;
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
    expect(paletteManager.state.activePalette).to.equal(activePalette);
    var colorNode = TestUtils.scryRenderedDOMComponentsWithClass(
      paletteManager, 'color')[0];

    TestUtils.Simulate.click(colorNode);

    expect(onPrimaryColorChange.called).to.be.true;
    expect(onPrimaryColorChange.calledWith(color)).to.be.true;
  });

  it('allows the user to create a new palette', function () {
    // NOTE: jsdom doesn't implement window.prompt as of 2015/06/12
  });

  it('shows an EditPalette window on click', function () {
    var editButton = document.querySelector('.edit-palette.btn');
    TestUtils.Simulate.click(editButton);
    expect(paletteManager.state.isEditingPalette).to.be.true;
    var editPalette = document.querySelector('.edit-palette.modal');
    expect(editPalette).to.be.ok;
  });


  it('cancels the edited palette on Cancel click', function () {
    var editButton = document.querySelector('.edit-palette.btn');
    TestUtils.Simulate.click(editButton);

    var newButton = document.querySelector('.edit-palette .new.color');
    TestUtils.Simulate.click(newButton);

    var activePalette = paletteManager.state.activePalette;
    var originalPalette = paletteManager.state.palettes[activePalette];
    var originalLen = originalPalette.length;

    var cancelButton = document.querySelector('.edit-palette .cancel.btn');
    TestUtils.Simulate.click(cancelButton);
    var currentPalette = paletteManager.state.palettes[activePalette];
    expect(currentPalette.length).to.equal(originalLen);
  });

  it('saves the edited palette on Save click', function () {
    var editButton = document.querySelector('.edit-palette.btn');
    TestUtils.Simulate.click(editButton);

    var newButton = document.querySelector('.edit-palette .new.color');
    TestUtils.Simulate.click(newButton);

    var activePalette = paletteManager.state.activePalette;
    var originalPalette = paletteManager.state.palettes[activePalette];
    var originalLen = originalPalette.length;

    var saveBtn = document.querySelector('.edit-palette .save.btn');
    TestUtils.Simulate.click(saveBtn);
    var currentPalette = paletteManager.state.palettes[activePalette];
    expect(currentPalette.length).to.equal(originalLen + 1);
  });


  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
