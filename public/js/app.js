require('babel/polyfill');

let $ = require('jquery');
let React = require('react');
let Router = require('react-router');

let DefaultRoute = Router.DefaultRoute;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

import Header from './components/header';
import Footer from './components/footer';
import DrawCtrl from './components/draw_ctrl';
import Map from './components/map';
import Music from './components/music';
import Play from './components/play';

$(function () {
  let App = React.createClass({
    render: function () {
      return (
        <div id="root">
          <Header/>

          <div id="content">
            <RouteHandler/>
          </div>

          <div id="modal-container"></div>
          <div id="context-menu-container"></div>

          <Footer/>
        </div>
      );
    }
  });

  let routes = (
    <Route name="app" path="/" handler={App}>
      <Route name="draw" handler={DrawCtrl}/>
      <Route name="map" handler={Map}/>
      <Route name="music" handler={Music}/>
      <Route name="play" handler={Play}/>
      <DefaultRoute handler={DrawCtrl}/>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
