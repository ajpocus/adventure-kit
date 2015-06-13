require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var DrawToolList = require('../../public/js/components/draw_tool_list');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;

describe('DrawToolList', function () {
  var drawToolList;

  beforeEach(function () {
    drawToolList = React.render(
      <DrawToolList/>,
      document.body
    );
  });

  it('has a default active tool', function () {
    expect(drawToolList.state.activeTool).to.be.ok;
    var activeTool = document.querySelector('.tool .active.btn');
    expect(activeTool).to.be.ok;
  });

  it('sets the active tool on click', function () {
    var originalActiveTool = drawToolList.state.activeTool;
    var newActiveToolBtn = document.querySelectorAll('.tool .btn')[1];
    TestUtils.Simulate.click(newActiveToolBtn);
    expect(originalActiveTool).to.not.equal(drawToolList.state.activeTool);
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
