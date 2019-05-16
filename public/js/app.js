'use strict';

// Declare app level module which depends on filters, and services

angular.module('upApp', [
        //libraries
        'ngRoute'
        //controller
        , 'upApp.landingController'
]).
config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
}).
run([ '$rootScope', '$http'
        , function($rootScope, $http){
    }]);
