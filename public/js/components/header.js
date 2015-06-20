let React = require('react');
let Router = require('react-router');
let Link = Router.Link;

let Header = React.createClass({
  getInitialState: function () {
    return {
      activeTab: 'Draw'
    };
  },

  render: function () {
    let tabs = [];
    let tabNames = ['Draw', 'Map', 'Music', 'Play'];
    for (let i = 0; i < tabNames.length; i++) {
      let tabName = tabNames[i];
      let className = 'tab';
      if (tabName === this.state.activeTab) {
        className += ' active';
      }

      tabs.push(
        <li className={className} key={tabName}>
          <Link to={tabName.toLowerCase()}
                onClick={this.setActiveTab.bind(this, tabName)}>
            {tabName}
          </Link>
        </li>
      );
    }

    return (
      <header id="header">
        <h1 className="title">Adventure Kit</h1>
        <nav>
          <ul className="tabs">
            {tabs}
          </ul>
        </nav>
      </header>
    );
  },

  setActiveTab: function (tabName) {
    this.setState({ activeTab: tabName });
  }
});

export default Header;
