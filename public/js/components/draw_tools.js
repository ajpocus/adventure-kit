let React = require('react');

let DrawTools = React.createClass({
  render: function () {
    return (
      <div className="draw-tools">
        <ul className="tool-list">
          <li className="tool">
            <button className="btn">
              <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
            </button>
          </li>

          <li className="tool">
            <button className="btn">
              <img className="icon" src="/img/icons/glyphicons-481-bucket.png"/>
            </button>
          </li>
        </ul>
      </div>
    );
  }
});

export default DrawTools;
