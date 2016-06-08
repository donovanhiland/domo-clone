angular.module("domoApp", ["ui.router", 'ui.bootstrap'])
.config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './app/components/home/homeTmpl.html',
      controller: 'loginCtrl'
    })


    // dashboard views/subviews
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
              return response;
            });
        }
      }
    })
    .state('dashboard.overview', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/overview/dashboard.overview.html',
      controller: 'dashboardCtrl'
    })
    .state('dashboard.twitter-globe', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/globe/dashboard.twitter-globe.html',
      controller: 'globeCtrl'
    })
    .state('dashboard.info', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/info/dashboard.info.html',
      controller:'infoCtrl'
    })
    .state('dashboard.alerts', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/alerts/alertTmpl.html',
      controller:'alertsCtrl'
    })
    .state('dashboard.info', {
      url: '/dashboard',
      // templateUrl: make new template of picture
      controller: 'dashboardCtrl',
    })


    $urlRouterProvider.otherwise('/home');
});
