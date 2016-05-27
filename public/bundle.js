angular.module("domoApp", ["ui.router"]);

angular.module("domoApp").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('', {
      url: '/',
      templateUrl: '',
      controller: ''
    });

    $urlRouterProvider.otherwise('/home');
}]);

