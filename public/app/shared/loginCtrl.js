angular.module("domoApp").controller("loginCtrl", function($scope, loginService, $state) {

  $scope.register = function() {
    loginService.register($scope.newUser).then(function(response){
      clear();
    });
  };

  $scope.login = function() {
    loginService.login($scope.credentials).then(function(response) {
      $state.go('dashboard');
      $scope.user = response.data._id;
      $scope.credentials = null;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    })
  }

  var clear = function() {
    $scope.newUser = null;
    return alert("account creation successful");
  }



});
