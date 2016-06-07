angular.module('domoApp')
  .directive('excelForm', function () {
    return {
      restrict: "E",
      controller: 'dashboardCtrl',
      templateUrl: './app/components/dashboard/excel/excelForm.html'
  } //return
}) //directive
