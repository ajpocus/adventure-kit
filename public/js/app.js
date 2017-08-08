import 'babel-polyfill';

import $ from 'jquery';
import React from 'react';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import ReactDOM from 'react-dom'

import Header from './components/header';
import Footer from './components/footer';
import DrawCtrl from './components/draw_ctrl';
import MapCtrl from './components/map';
import MusicCtrl from './components/music_ctrl';
import Play from './components/play';

$(function () {
  class App extends React.Component {
    render() {
      return (
        <div id="root">
          <Router>
            <div>  
              <Header />

              <div id="content">
                <Route path="/draw" component={DrawCtrl} />
                <Route path="/map" component={MapCtrl} />
                <Route path="/music" component={MusicCtrl} />
                <Route path="/play" component={Play} />
              </div>

              <div id="modal-container"></div>
              <div id="context-menu-container"></div>

              <Footer/>
            </div>
          </Router>  
        </div>
      );
    }    
  };

  ReactDOM.render(<App />, document.querySelector('#root'));
});
