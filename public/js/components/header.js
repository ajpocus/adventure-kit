let React = require('react');
let Router = require('react-router');
let Link = Router.Link;

let Header = React.createClass({
  getDefaultProps: function () {
    return {
      tabs: [
        {
          name: 'Draw',
          imgUrl: '/img/iconic/pencil.png'
        },
        {
          name: 'Map',
          imgUrl: '/img/iconic/map.png'
        },
        {
          name: 'Music',
          imgUrl: '/img/iconic/musical-note.png'
        },
        {
          name: 'Play',
          imgUrl: '/img/iconic/media-play.png'
        }
      ]
    };
  },

  getInitialState: function () {
    return {
      activeTab: this.props.tabs[0].name
    };
  },

  render: function () {
    let tabs = this.props.tabs;
    let tabViews = [];

    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      let className = 'tab';
      if (tab.name === this.state.activeTab) {
        className += ' active';
      }

      tabViews.push(
        <li className={className} key={tab.name}>
          <Link to={tab.name.toLowerCase()}
                onClick={this.setActiveTab.bind(this, tab.name)}>
            <img className="pixel icon"
                 src={tab.imgUrl}/>
          </Link>
        </li>
      );
    }

    return (
      <header id="header">
        <h1 className="title">Adventure Kit</h1>
        <nav>
          <ul className="tabs">
            {tabViews}
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
