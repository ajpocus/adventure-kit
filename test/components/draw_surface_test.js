var Canvas = require('canvas');
require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var DrawSurface = require('../../public/js/components/draw_surface');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;
var sinon = require('sinon');

describe('DrawSurface', function () {
  var drawSurface;
  var primaryColor = '#000000';
  var secondaryColor = '#ffffff';

  beforeEach(function () {
    drawSurface = React.render(
      <DrawSurface primaryColor={primaryColor}
                   secondaryColor={secondaryColor}/>,
      document.body
    );
  });

  it('draws a checkered background', function () {
    expect(drawSurface.state.bgCtx).to.be.ok;
  });

  afterEach(function () {
    React.unmountComponentAtNode(document.body);
  });
});
