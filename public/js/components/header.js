let React = require('react');
let Router = require('react-router');
let Link = Router.Link;

let Header = React.createClass({
  mixins: [Router.State],

  getInitialState: function () {
    let routes = this.getRoutes();
    let lastRoute = routes[routes.length - 1];

    return {
      activeTab: lastRoute.name || 'draw'
    };
  },

  render: function () {
    let tabs = [];
    let tabNames = ['Draw', 'Map', 'Music'];
    for (let i = 0; i < tabNames.length; i++) {
      let tabName = tabNames[i];
      let className = 'tab';
      if (tabName.toLowerCase() === this.state.activeTab) {
        className += ' active';
      }

      tabs.push(
        <li className={className} key={tabName}>
          <Link to={tabName.toLowerCase()}
                onClick={this.setActiveTab.bind(this, tabName.toLowerCase())}>
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
