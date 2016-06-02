var app = angular.module("domoApp");
app.factory("excelReader", ['$q', '$rootScope',
    function($q, $rootScope) {
        var service = function(data) {
            angular.extend(this, data);
        };
        service.readFile = function(file, showPreview) {
            var deferred = $q.defer();
            XLSXReader(file, showPreview, function(data) {
                $rootScope.$apply(function() {
                    deferred.resolve(data);
                });
            });
            return deferred.promise;
        };
        return service;
    }
 ]);
app.controller('excelController', function($scope, excelReader) {
  $scope.json_string = "";
    $scope.fileChanged = function(files) {
        $scope.isProcessing = true;
        $scope.sheets = [];
        $scope.excelFile = files[0];
        excelReader.readFile($scope.excelFile, true).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            $scope.isProcessing = false;
        });
    };
  $scope.updateJSONString = function() {
    $scope.excelData = $scope.sheets[$scope.selectedSheetName];
      $scope.excelData = $scope.excelData.data
  }

});
