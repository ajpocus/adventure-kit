let React = require('react');

import ToolList from './tool_list';

let ManageToolList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Resize',
          imgUrl: '/img/icons/glyphicons-216-resize-full.png'
        },
        {
          name: 'Export',
          imgUrl: '/img/icons/glyphicons-420-disk-export.png'
        },
        {
          name: 'Save',
          imgUrl: '/img/icons/glyphicons-447-floppy-save.png'
        }
      ]
    };
  },

  render: function () {
    return (
      <div className="manage-buttons">
        <ToolList tools={this.props.tools}
                  onSetActiveTool={this.handleClick}/>
      </div>
    );
  },

  handleClick: function (name) {
    switch (name) {
      case 'Resize':
        this.props.onResizeClick();
        break;

      case 'Export':
        this.props.onExportClick();
        break;

      case 'Save':
        this.props.onSaveClick();
        break;

      default:
        return true;
    }
  }
});

export default ManageToolList;
