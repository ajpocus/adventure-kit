require('../support/testdom')('<html><body></body></html>');

var React = require('react/addons');
var PaletteManager = require('../../public/js/components/palette_manager');
var TestUtils = React.addons.TestUtils;

describe('PaletteManager', function () {
  var onPrimaryColorChange;
  var onSecondaryColorChange;
  var paletteManager;
  var activePalette;
  var palette;
  var color;

  beforeEach(function () {
    onPrimaryColorChange = jest.genMockFunction();
    onSecondaryColorChange = jest.genMockFunction();

    paletteManager = TestUtils.renderIntoDocument(
      <PaletteManager onPrimaryColorChange={onPrimaryColorChange}
                      onSecondaryColorChange={onSecondaryColorChange}
                      isEditingPalette={false}/>
    );

    activePalette = 'Rainbow';
    palette = paletteManager.state.palettes[activePalette];
    color = palette[0];
  });

  it('changes the primary color on click', function () {
    expect(paletteManager.state.activePalette).toEqual(activePalette);
    var colorNode = TestUtils.scryRenderedDOMComponentsWithClass(
      paletteManager, 'color')[0];

    TestUtils.Simulate.click(colorNode);

    expect(onPrimaryColorChange.mock.calls.length).toBe(1);
    expect(onPrimaryColorChange.mock.calls[0][0]).toBe(color);
  });

  it('allows the user to create a new palette', function () {
    // NOTE: jsdom doesn't implement window.prompt as of 2015/06/12
  });

  it('shows an EditPalette window on click', function () {
    var editButton = TestUtils.findRenderedDOMComponentWithClass(
                       paletteManager, 'edit-palette btn');
    TestUtils.Simulate.click(editButton);
    expect(paletteManager.state.isEditingPalette).toBe(true);
    var editPalette = TestUtils.findRenderedDOMComponentWithClass(
                        paletteManager, 'edit-palette modal');
    expect(editPalette).toNotBe(null);
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
