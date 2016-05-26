angular.module("domoApp").config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('', {
      url: '/',
      templateUrl: '',
      controller: ''
    });

    $urlRouterProvider.otherwise('/home');
});
