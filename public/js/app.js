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
import MapController from './components/map_controller';
import MusicController from './components/music_controller';

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
      <Route name="map" handler={MapController}/>
      <Route name="music" handler={MusicController}/>
      <DefaultRoute handler={DrawController}/>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
