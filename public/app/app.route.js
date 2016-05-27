angular.module("domoApp").config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('', {
      url: '/',
      templateUrl: '',
      controller: ''
    });

    $urlRouterProvider.otherwise('/home');
});
