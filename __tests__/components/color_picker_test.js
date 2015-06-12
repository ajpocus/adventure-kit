var React = require('react/addons');
var ColorPicker = require('../../public/js/components/color_picker');
var TestUtils = React.addons.TestUtils;

/**
  * Since there's no standard way to select or manipulate the color window
  * for input[type="color"], I'll just test value-setters for now, and make
  * sure the callbacks are being called.
  */

describe('ColorPicker', function () {
  var primaryColor;
  var secondaryColor;
  var onPrimaryColorChange;
  var onSecondaryColorChange;
  var colorPicker;

  beforeEach(function () {
    primaryColor = '#000000';
    secondaryColor = '#ffffff';
    onPrimaryColorChange = jest.genMockFunction();
    onSecondaryColorChange = jest.genMockFunction();

    colorPicker = TestUtils.renderIntoDocument(
      <ColorPicker primaryColor={primaryColor}
                   secondaryColor={secondaryColor}
                   onPrimaryColorChange={onPrimaryColorChange}
                   onSecondaryColorChange={onSecondaryColorChange}/>
    );
  });

  it('sets a primary color', function () {
    var primaryNode = colorPicker.refs.primaryColor.getDOMNode();
    TestUtils.Simulate.change(primaryNode, {
      target: {
        value: '#beefee'
      }
    });
    expect(onPrimaryColorChange.mock.calls.length).toEqual(1);
  });

  it('sets a secondary color', function () {
    var secondaryNode = colorPicker.refs.secondaryColor.getDOMNode();
    TestUtils.Simulate.change(secondaryNode, {
      target: {
        value: '#beefee'
      }
    });
    expect(onSecondaryColorChange.mock.calls.length).toEqual(1);
  });

  afterEach(function () {
    primaryColor = undefined;
    secondaryColor = undefined;
    onPrimaryColorChange = undefined;
    onSecondaryColorChange = undefined;
    colorPicker = undefined;

    React.unmountComponentAtNode(document.body);
  });
});
