"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']);
"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: './app/components/home/homeTmpl.html',
    controller: 'loginCtrl'
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: './app/components/dashboard/dashboardTmpl.html',
    controller: 'dashboardCtrl',
    resolve: {
      checkAuth: ["$state", "dashboardService", function checkAuth($state, dashboardService) {
        dashboardService.checkAuth().then(function (response) {
          console.log(response);
          if (response === 'unauthorized') {
            $state.go('home');
          }
          return response.data;
        });
      }]
    }
  });

  $urlRouterProvider.otherwise('/home');
}]);
"use strict";

angular.module("domoApp").controller("loginCtrl", ["$scope", "loginService", "$state", function ($scope, loginService, $state) {

  $scope.register = function () {
    loginService.register($scope.newUser).then(function (response) {
      clear();
    });
  };

  $scope.login = function () {
    loginService.login($scope.credentials).then(function (response) {
      $state.go('dashboard');
      $scope.user = response.data._id;
      $scope.credentials = null;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    });
  };

  var clear = function clear() {
    $scope.newUser = null;
    return alert("account creation successful");
  };
}]);
"use strict";

angular.module("domoApp").service("loginService", ["$http", function ($http) {

  this.register = function (user) {
    return $http({
      method: "POST",
      url: '/users',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.login = function (user) {
    return $http({
      method: "POST",
      url: "/login",
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.getUsers = function () {
    return $http({
      method: 'GET',
      url: '/users'
    }).then(function (response) {
      return response;
    });
  };
}]);
'use strict';

angular.module('domoApp').directive('navDirective', function () {

  return {
    restrict: 'E',
    templateUrl: './app/shared/nav/navTmpl.html'
  };
});
'use strict';

angular.module('domoApp').controller('dashboardCtrl', ["$scope", "$log", "checkAuth", "dashboardService", "$state", function ($scope, $log, checkAuth, dashboardService, $state) {

  $scope.checkAuth = checkAuth;
  console.log($scope.checkAuth);

  //drop down
  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
}]);
'use strict';

angular.module('domoApp').service('dashboardService', ["$http", function ($http) {

  this.checkAuth = function () {
    console.log('service');
    return $http({
      method: 'GET',
      url: '/checkAuth'
    }).then(function (response) {
      return response.data;
    });
  };
}]);
'use strict';

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);