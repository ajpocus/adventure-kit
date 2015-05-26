require('babel/polyfill');

let $ = require('jquery');
let angular = require('angular');

import DrawSurface from'./draw_surface';

$(function () {
  let app = angular.module('app', [require('angular-ui-router')]);

  app.config(function ($stateProvider, $urlRouterProvider) {
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
  let drawSurface = new DrawSurface(document.getElementById('render'));
});
