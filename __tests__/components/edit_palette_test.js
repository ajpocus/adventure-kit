require('../support/testdom')('<html><body></body></html>');

var React = require('react/addons');
var EditPalette = require('../../public/js/components/edit_palette');
var TestUtils = React.addons.TestUtils;

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
    onPaletteChange = jest.genMockFunction();
    editPalette = TestUtils.renderIntoDocument(
      <EditPalette palette={palette}
                   name={name}
                   onPaletteChange={onPaletteChange}/>
    );
  });

  it('should add a color', function () {
    var newColorBtn = TestUtils.findRenderedDOMComponentWithClass(
                        editPalette, 'new color');
    var len = palette.length;
    TestUtils.Simulate.click(newColorBtn);

    expect(palette.length).toEqual(len + 1);
    expect(palette[len]).toBe('#ffffff');

    var colors = TestUtils.scryRenderedDOMComponentsWithTag(
                   editPalette, 'li');

    expect(colors.length).toBe(palette.length + 1) // +1 for new color button
  });

  it('should remove a color', function () {
    var removeBtn = TestUtils.scryRenderedDOMComponentsWithClass(
                      editPalette, 'remove')[0];
    var len = palette.length;

    TestUtils.Simulate.click(removeBtn);
    expect(palette.length).toEqual(len - 1);
  });

  it('should set the active color on click', function () {
    var secondColor = TestUtils.scryRenderedDOMComponentsWithClass(
                       editPalette, 'color')[1];
    TestUtils.Simulate.click(secondColor);

    expect(editPalette.state.activePaletteColor).toBe(palette[1]);
  });

  it('should edit an existing color');

  it('should cancel the palette changes on Cancel click');

  it('should save the palette changes on Save click');

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
