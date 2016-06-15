angular.module("domoApp").controller("loginCtrl", function($scope, loginService, $state) {

  $scope.register = () => {
    loginService.register($scope.newUser)
    .then((response) =>{
      clear();
    });
  };

  $scope.login = () => {
    loginService.login($scope.credentials)
    .then((response) => {
      $state.go('dashboard.overview');
      $scope.credentials = null;
      $scope.user = response.data._id;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    });
  };

  let clear = () => {
    $scope.newUser = null;
    return alert("account creation successful");
  };



});
