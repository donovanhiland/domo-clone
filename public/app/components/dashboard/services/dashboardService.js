angular.module('domoApp').service('dashboardService', function($http){

  this.checkAuth = function() {
    console.log('service');
    return $http({
      method: 'GET',
      url: '/checkAuth'
    }).then(function(response) {
      return response.data;
    });
  };

});
