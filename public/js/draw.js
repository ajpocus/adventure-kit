let React = require('react');

let Draw = React.createClass({
  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>
        <div id="render"></div>
        <input type="color" id="flat-color" className="color"/>
        <input type="color" id="primary-color" className="color"/>
        <input type="color" id="secondary-color" className="color"/>
      </div>
    );
  }
});

export default Draw;
