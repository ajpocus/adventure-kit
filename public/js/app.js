require('babel/polyfill');

let $ = require('jquery');
let angular = require('angular');
let uiRouter = require('angular-ui-router');

import DrawCtrl from './controllers/draw';
import MapCtrl from './controllers/map';
import MusicCtrl from './controllers/music';
import DrawSurfaceDirective from './directives/draw_surface';

$(function () {
  let kitApp = angular.module('kitApp', ['ui-router']);

  kitApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/draw');

    $stateProvider
      .state('draw', {
        url: '/draw',
        templateUrl: 'templates/draw.html'
      })
      .state('map', {
        url: '/map',
        templateUrl: 'templates/map.html'
      })
      .state('music', {
        url: '/music',
        templateUrl: 'templates/music.html'
      });
  });

  kitApp.controller('DrawCtrl', DrawCtrl);
  kitApp.controller('MapCtrl', MapCtrl);
  kitApp.controller('MusicCtrl', MusicCtrl);

  kitApp.directive('drawSurface', DrawSurfaceDirective);
});
