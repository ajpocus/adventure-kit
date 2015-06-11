var React = require('react/addons');
var PaletteManager = require('../public/js/components/palette_manager');
var TestUtils = React.addons.TestUtils;

describe('PaletteManager', function () {
  it('changes the primary color on click', function () {
    var changeMock = jest.genMockFunction();
    var onPrimaryColorChange = new changeMock();
    var onSecondaryColorChange = new changeMock();

    var paletteManager = TestUtils.renderIntoDocument(
      <PaletteManager onPrimaryColorChange={onPrimaryColorChange}
                      onSecondaryColorChange={onSecondaryColorChange}/>
    );

    var colorNode = TestUtils.findRenderedDOMComponentWithTag(
      paletteManager, 'li');
    TestUtils.Simulate.click(colorNode);
    expect(onPrimaryColorChange.mock.calls.length).toBe(2);
  });
});
