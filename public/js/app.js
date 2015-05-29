require('babel/polyfill');

let $ = require('jquery');
let React = require('react');
let Router = require('react-router');

let DefaultRoute = Router.DefaultRoute;
let Link = Router.Link;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

import Draw from './components/draw';
import Map from './components/map';
import Music from './components/music';

$(function () {
  let App = React.createClass({
    render: function () {
      return (
        <div id="root">
          <header id="header">
            <h1 className="title">Adventure Kit</h1>
            <nav>
              <ul className="tabs">
                <li className="tab active"><Link to="draw">Draw</Link></li>
                <li className="tab"><Link to="map">Map</Link></li>
                <li className="tab"><Link to="music">Music</Link></li>
              </ul>
            </nav>
          </header>

          <div id="content">
            <RouteHandler/>
          </div>

          <footer id="footer">
            <ul className="links">
              <li className="attribution">
                "<a href="http://glyphicons.com/">
                GLYPHICONS
                </a>"&nbsp;is licensed under&nbsp;
                <a href="https://creativecommons.org/licenses/by/3.0/us/">
                  CC BY 3.0
                </a>
              </li>
            </ul>
          </footer>
        </div>
      );
    }
  });

  let routes = (
    <Route name="app" path="/" handler={App}>
      <Route name="draw" handler={Draw}/>
      <Route name="map" handler={Map}/>
      <Route name="music" handler={Music}/>
      <DefaultRoute handler={Draw}/>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
