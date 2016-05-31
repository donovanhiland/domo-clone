angular.module("domoApp").controller("loginCtrl", function($scope, loginService, $state) {

  $scope.register = function() {
    loginService.register($scope.newUser).then(function(response){
    });
  };

  $scope.login = function() {
    loginService.login($scope.credentials).then(function(response) {
      $state.go('dashboard');
      $scope.user = response.data._id;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    })
  }

})
