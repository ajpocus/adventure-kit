import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeTab: props.tabs[0].name
    };
  }

  render() {
    return (
      <header id="header">
        <h1 className="title">Adventure Kit</h1>
        <nav>
          <ul className="tabs">
            {(() => {
              let tabs = this.props.tabs;

              return tabs.map((tab) => {
                let className = 'tab';
                if (tab.name === this.state.activeTab) {
                  className += ' active';
                }

                return (
                  <li className={className} key={tab.name}>
                    <Link to={tab.name.toLowerCase()}
                          onClick={this.setActiveTab.bind(this, tab.name)}>
                      <img className="pixel icon"
                           src={tab.imgUrl}/>
                    </Link>
                  </li>
                );
              });
            })()}
          </ul>
        </nav>
      </header>
    );
  }

  setActiveTab(tabName) {
    this.setState({ activeTab: tabName });
  }
};

Header.defaultProps = {
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

export default Header;
