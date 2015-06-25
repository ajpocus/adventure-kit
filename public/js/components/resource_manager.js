let React = require('react');

let ResourceManager = React.createClass({
  propTypes: {
    resources: React.PropTypes.array,
    onSetActiveResource: React.PropTypes.func
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.activeResource !== prevState.activeResource) {
      this.props.onSetActiveResource(this.state.activeResource);
    }
  },

  render: function () {
    let resourceViews = [];
    for (let i = 0; i < this.props.resources.length) {
      let resource = this.props.resources[i];

      let className = "resource";
      if (resource.name === this.state.activeResource) {
        className += " active";
      }

      resourceViews.push(
        <li className={className}
            key={i}
            onClick={this.setActiveResource.bind(resource.name)}>
          <div className="image">
            <img src={resource.imgUrl}/>
          </div>

          <div className="name">
            {resource.name}
          </div>
        </li>
      );
    }

    return (
      <ul className="resources">
        {resourceViews}
      </ul>
    );
  },

  setActiveResource: function (name) {
    this.setState({ activeResource: name });
  }
});
