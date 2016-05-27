"use strict";

angular.module("domoApp", ["ui.router"]);
'use strict';

angular.module("domoApp").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('', {
    url: '/',
    templateUrl: '',
    controller: ''
  });

  $urlRouterProvider.otherwise('/home');
}]);