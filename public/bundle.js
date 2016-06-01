"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']);
"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: './app/components/home/homeTmpl.html'
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: './app/components/dashboard/dashboardTmpl.html'
  });

  $urlRouterProvider.otherwise('/home');
}]);
"use strict";

angular.module("domoApp").controller("loginCtrl", ["$scope", "loginService", "$state", function ($scope, loginService, $state) {

  $scope.register = function () {
    loginService.register($scope.newUser).then(function (response) {});
  };

  $scope.login = function () {
    loginService.login($scope.credentials).then(function (response) {
      $state.go('dashboard');
      $scope.user = response.data._id;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    });
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

angular.module('domoApp').service('mainService', ["$http", function ($http) {

    this.createCard = function (newTitle) {
        return $http({
            method: "POST",
            url: "/card",
            data: {
                title: newTitle
            }
        }).then(function (response) {
            return response.data;
        });
    };
}]);
'use strict';

angular.module('domoApp').controller('dashboardCtrl', ["$scope", "$log", "mainService", "$state", function ($scope, $log, mainService, $state) {

  //drop down
  // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  //create card
  $scope.createCard = function () {
    mainService.createCard($scope.newTitle).then(function (response) {
      console.log("createCard", response);
      // $state.go("card",{id:response._id})
    });
  };
}]);
'use strict';

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);