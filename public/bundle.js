"use strict";

<<<<<<< HEAD
angular.module("domoApp", ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html'
    });
=======
angular.module("domoApp", ["ui.router"]);
'use strict';
>>>>>>> master

angular.module("domoApp").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('', {
    url: '/',
    templateUrl: '',
    controller: ''
  });

<<<<<<< HEAD

angular.module('domoApp').controller('mainCtrl', ["$scope", function($scope){

}]);

angular.module('domoApp').directive('navDirective', function(){

  return {
    restrict: 'E',
    templateUrl: './app/components/nav/navTmpl.html'
  };

});
=======
  $urlRouterProvider.otherwise('/home');
}]);
>>>>>>> master
