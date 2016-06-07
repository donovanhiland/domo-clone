angular.module("domoApp", ["ui.router", 'ui.bootstrap']).config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html',
      controller: 'loginCtrl'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/dashboardTmpl.html',
      controller: 'dashboardCtrl',
      resolve: {
        checkAuth: function($state, dashboardService) {
          dashboardService.checkAuth()
            .then(function(response) {
              console.log(response);
              if (response === 'unauthorized') {
                $state.go('home');
                alert('Sign in to view dashboard');
              }
              return response.data;
            });
        }
      }
    })

    .state('dashboard.overview', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/overview/dashboard.overview.html',
      controller: 'dashboardCtrl'
    })

    .state('dashboard.alerts', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/alerts/alertTmpl.html',
      controller:'alertsCtrl'
    });

    $urlRouterProvider.otherwise('/home');
});
