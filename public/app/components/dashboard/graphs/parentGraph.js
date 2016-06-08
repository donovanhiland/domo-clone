angular.module('domoApp')
.directive('graphs', function () {
  return {
    retrict: "AE",
    templateUrl: 'app/components/dashboard/graphs/graphs.html',
    controller: 'app/components/dashboard/graphs/graphCtrl.js',
    scope: {
      graphType: '=',
      graphData: '='
    }
  }
})
