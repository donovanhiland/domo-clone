angular.module("domoApp", ["ui.router"]).config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html'
    });

    $urlRouterProvider.otherwise('/home');
});
