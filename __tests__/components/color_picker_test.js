var React = require('react/addons');
var ColorPicker = require('../../public/js/components/color_picker');
var TestUtils = React.addons.TestUtils;

/**
  * Since there's no standard way to select or manipulate the color window
  * for input[type="color"], I'll just test value-setters for now, and make
  * sure the callbacks are being called.
  */

describe('ColorPicker', function () {
  it('sets a primary color', function () {
    var primaryColor = '#000000';
    var secondaryColor = '#ffffff';
    var onPrimaryColorChange = jest.genMockFunction();
    var onSecondaryColorChange = jest.genMockFunction();

    var colorPicker = TestUtils.renderIntoDocument(
      <ColorPicker primaryColor={primaryColor}
                   secondaryColor={secondaryColor}
                   onPrimaryColorChange={onPrimaryColorChange}
                   onSecondaryColorChange={onSecondaryColorChange}/>
    );

    var primaryNode = colorPicker.refs.primaryColor.getDOMNode();
    TestUtils.Simulate.change(primaryNode, {
      target: {
        value: '#beefee'
      }
    });
    expect(onPrimaryColorChange.mock.calls.length).toEqual(1);
  });

  it('sets a secondary color', function () {
    var primaryColor = '#000000';
    var secondaryColor = '#ffffff';
    var onPrimaryColorChange = jest.genMockFunction();
    var onSecondaryColorChange = jest.genMockFunction();

    var colorPicker = TestUtils.renderIntoDocument(
      <ColorPicker primaryColor={primaryColor}
                   secondaryColor={secondaryColor}
                   onPrimaryColorChange={onPrimaryColorChange}
                   onSecondaryColorChange={onSecondaryColorChange}/>
    );

    var secondaryNode = colorPicker.refs.secondaryColor.getDOMNode();
    TestUtils.Simulate.change(secondaryNode, {
      target: {
        value: '#beefee'
      }
    });
    expect(onSecondaryColorChange.mock.calls.length).toEqual(1);
  });
});
