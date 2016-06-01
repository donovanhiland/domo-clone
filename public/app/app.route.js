angular.module("domoApp", ["ui.router", 'ui.bootstrap']).config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/dashboardTmpl.html',
      controller: 'dashboardCtrl'
    });

    $urlRouterProvider.otherwise('/home');
});
