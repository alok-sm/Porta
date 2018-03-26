'use strict';

/**
 * @ngdoc overview
 * @name viewerApp
 * @description
 * # viewerApp
 *
 * Main module of the application.
 */
angular
  .module('viewerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngOnload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/root.html',
        controller: 'RootCtrl',
        controllerAs: 'root'
      })
      .when('/single', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/aggregate', {
        templateUrl: 'views/aggregate.html',
        controller: 'AggregateCtrl',
        controllerAs: 'aggregate'
      })
      .when('/popup', {
        templateUrl: 'views/popup.html',
        controller: 'PopupCtrl',
        controllerAs: 'popup'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
