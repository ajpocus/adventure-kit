var React = require('react/addons');
var PaletteManager = require('../../public/js/components/palette_manager');
var TestUtils = React.addons.TestUtils;

describe('PaletteManager', function () {
  it('changes the primary color on click', function () {
    var onPrimaryColorChange = jest.genMockFunction();
    var onSecondaryColorChange = jest.genMockFunction();

    var paletteManager = TestUtils.renderIntoDocument(
      <PaletteManager onPrimaryColorChange={onPrimaryColorChange}
                      onSecondaryColorChange={onSecondaryColorChange}/>
    );

    var colorNode = TestUtils.scryRenderedDOMComponentsWithClass(
      paletteManager, 'color')[0];
    var color = colorNode.props.style.background;

    TestUtils.Simulate.click(colorNode);

    // should make call to set primary color
    expect(onPrimaryColorChange.mock.calls.length).toBe(1);
    // should pass the color as the only parameter
    expect(onPrimaryColorChange.mock.calls[0][0]).toBe(color);
  });
});
