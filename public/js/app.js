'use strict';

require('babel/polyfill');

let $ = require('jquery');
let React = require('react');
let Router = require('react-router');

let DefaultRoute = Router.DefaultRoute;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

import Header from './components/header';
import Footer from './components/footer';
import DrawController from './components/draw_controller';
import Map from './components/map';
import Music from './components/music';

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

          <Footer/>
        </div>
      );
    }
  });

  let routes = (
    <Route name="app" path="/" handler={App}>
      <Route name="draw" handler={DrawController}/>
      <Route name="map" handler={Map}/>
      <Route name="music" handler={Music}/>
      <DefaultRoute handler={DrawController}/>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
