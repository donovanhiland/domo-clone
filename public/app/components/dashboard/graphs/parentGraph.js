angular.module('domoApp')
.directive('graphs', () => {
  return {
    retrict: "AE",
    templateUrl: 'app/components/dashboard/graphs/graphs.html',
    // controller: 'graphCtrl',
    scope: {
      graphType: '=',
      graphData: '='
    }
  }
})
