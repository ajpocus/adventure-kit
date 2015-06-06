let React = require('react');

let PencilTool = React.createClass({
  getDefaultProps: function () {
    return {
      name: 'Pencil',
      imgUrl: '/img/icons/glyphicons-31-pencil.png'
    }
  },

  render: function () {
    <DrawTool name={this.props.name}
              imgUrl={this.props.imgUrl}/>
  },

  draw: function () {}
});
