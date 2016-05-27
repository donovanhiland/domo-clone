"use strict";

angular.module("domoApp", ["ui.router"]);
"use strict";

angular.module("domoApp", ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: './app/components/home/homeTmpl.html'
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

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);