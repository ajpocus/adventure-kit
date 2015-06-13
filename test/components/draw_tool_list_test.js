require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var DrawToolList = require('../../public/js/components/draw_tool_list');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');

describe('DrawToolList', function () {
  var drawToolList;

  beforeEach(function () {
    drawToolList = React.render(
      <DrawToolList/>,
      document.body
    );
  });

  it('has a default active tool', function () {
    assert.ok(drawToolList.state.activeTool);
    var activeTool = document.querySelector('.tool .active.btn');
    assert.ok(activeTool);
  });

  it('sets the active tool on click', function () {
    var originalActiveTool = drawToolList.state.activeTool;
    var newActiveToolBtn = document.querySelectorAll('.tool .btn')[1];
    TestUtils.Simulate.click(newActiveToolBtn);
    assert.notEqual(originalActiveTool, drawToolList.state.activeTool);
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
