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
'use strict';

angular.module('domoApp').directive('navDirective', function () {

  return {
    restrict: 'E',
    templateUrl: './app/shared/nav/navTmpl.html'
  };
});
'use strict';

angular.module('domoApp').controller('dashboardCtrl', ["$scope", "$log", function ($scope, $log) {

  //drop down
  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
}]);
'use strict';

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);