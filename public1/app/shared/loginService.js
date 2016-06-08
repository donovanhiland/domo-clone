angular.module("domoApp").service("loginService", function($http){

  this.register = function(user) {
    return $http({
      method: "POST",
      url: '/users',
      data: user
    }).then(function(response){
      return response;
    });
  };

  this.login = function(user) {
    return $http({
      method: "POST",
      url: "/login",
      data: user
    }).then(function(response){
      return response;
    });
  };

  this.getUsers = function() {
  return $http({
    method: 'GET',
    url: '/users',
  }).then(function(response) {
    return response;
  });
};

});
