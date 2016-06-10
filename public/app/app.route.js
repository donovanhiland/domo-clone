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

        user: function($state, dashboardService) {
            return dashboardService.checkAuth()
            .then(function(response) {
              console.log(response);
              if (response === 'unauthorized') {
                $state.go('home');
                alert('Sign in to view dashboard');
              }
              else {
                return response;
              }
            });
          }

        }
    })
    .state('dashboard.overview', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/overview/dashboard.overview.html',
      controller: 'overviewCtrl'
    })
    .state('dashboard.twitter', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/twitter/twitterTmpl.html',
      controller: 'twitterCtrl'
    })
    .state('dashboard.twitter-globe', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/globe/dashboard.twitter-globe.html',
      controller: 'globeCtrl'
    })
    .state('dashboard.alerts', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/alerts/alertTmpl.html',
      controller:'alertsCtrl'
    })
    .state('dashboard.info', {
      url: '/dashboard',
      // templateUrl: make new template of picture
      controller: 'infoCtrl',
    })


    $urlRouterProvider.otherwise('/home');
});
