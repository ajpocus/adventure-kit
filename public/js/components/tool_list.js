let React = require('react');
import PropTypes from 'prop-types';

const ToolList = ({ tools, setActiveTool }) => (
  <div className="tools">
    <ul className="tool-list">
      {(() => {
        tools.map((tool) => {
          let className = "btn";
          if (tool.name === this.props.activeTool || tool.active) {
            className += " active";
          }

          return (
            <li className="tool" key={tool.name} title={tool.name}>
              <button className={className}
                      onClick={setActiveTool.bind(this, tool.name)}>
                <div className="img-container">
                  <img className="pixel icon" src={tool.imgUrl}/>
                </div>
              </button>
            </li>
          );
        });
      })()}
    </ul>
  </div>
);

export default ToolList;
