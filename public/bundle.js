angular.module("domoApp", ["ui.router"]);

angular.module("domoApp", ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html'
    });

    $urlRouterProvider.otherwise('/home');
}]);


angular.module('domoApp').controller('mainCtrl', ["$scope", function($scope){

}]);

angular.module('domoApp').directive('navDirective', function(){

  return {
    restrict: 'E',
    templateUrl: './app/components/nav/navTmpl.html'
  };

});
