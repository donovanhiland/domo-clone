angular.module("domoApp").service("loginService", function($http){

  this.register = function(user) {
    return $http({
      
    })
  }

  this.login = function() {
    return $http({
      method: "POST",
      url: "/login"
    }).then(function(response){
      return response;
    });
  };

});
