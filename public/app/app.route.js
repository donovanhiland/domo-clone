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

        user: ($state, dashboardService) => {
            return dashboardService.checkAuth()
            .then((response) => {
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
      url: '/overview',
      templateUrl: './app/components/dashboard/overview/dashboard.overview.html',
      controller: 'overviewCtrl'
    })
    .state('dashboard.twitter', {
      url: '/dashboard',
      templateUrl: './app/components/dashboard/twitter/twitterTmpl.html',
      controller: 'twitterCtrl'
    })
    .state('dashboard.twitter-globe', {
      url: '/twitter-globe',
      templateUrl: './app/components/dashboard/globe/dashboard.twitter-globe.html',
      controller: 'globeCtrl'
    })
    .state('dashboard.alerts', {
      url: '/alerts',
      templateUrl: './app/components/dashboard/alerts/alertTmpl.html',
      controller:'alertsCtrl'
    })
    .state('dashboard.info', {
      url: '/info',
      templateUrl:'./app/components/dashboard/info/dashboard.info.html',
      controller: 'infoCtrl'
    })
    .state('dashboard.settings', {
      url: '/settings',
      templateUrl:'./app/components/dashboard/settings/dashboard.settings.html',
      controller: 'settingsCtrl'
    });

    $urlRouterProvider.otherwise('/home');
});
