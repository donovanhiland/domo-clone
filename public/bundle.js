"use strict";

angular.module("domoApp", ["ui.router"]);
'use strict';

angular.module("domoApp").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: './app/components/home/homeTmpl.html'
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: './app/components/dashboard/dashboardTmpl.html'
  });

  $urlRouterProvider.otherwise('/home');
}]);
'use strict';

angular.module('domoApp').directive('navDirective', function () {

  return {
    restrict: 'E',
    templateUrl: './app/components/nav/navTmpl.html'
  };
});
"use strict";
'use strict';

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);