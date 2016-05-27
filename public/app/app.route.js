angular.module("domoApp").config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/dashboardTmpl.html'
    });

    $urlRouterProvider.otherwise('/home');
});
