require('babel/polyfill');

let $ = require('jquery');
let angular = require('angular');
let uiRouter = require('angular-ui-router');

import DrawCtrl from './controllers/draw';
import MapCtrl from './controllers/map';
import MusicCtrl from './controllers/music';
import DrawSurfaceDirective from './directives/draw_surface';

let kitApp = angular.module('kitApp', [uiRouter]);

kitApp.controller('DrawCtrl', DrawCtrl);
kitApp.controller('MapCtrl', MapCtrl);
kitApp.controller('MusicCtrl', MusicCtrl);

kitApp.directive('drawSurface', DrawSurfaceDirective);

kitApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/draw');

  $stateProvider
      .state('draw', {
        url: '/draw',
        templateUrl: 'templates/draw.html',
        controller: DrawCtrl
      })
      .state('map', {
        url: '/map',
        templateUrl: 'templates/map.html',
        controller: MapCtrl
      })
      .state('music', {
        url: '/music',
        templateUrl: 'templates/music.html',
        controller: MusicCtrl
      });
});
