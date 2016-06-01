angular.module('domoApp')
.controller('dashboardCtrl', function($scope, $log, checkAuth, dashboardService, $state){


$scope.checkAuth = checkAuth;
console.log($scope.checkAuth);





  //drop down
  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

});
