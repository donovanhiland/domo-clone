angular.module("domoApp")
.controller('dashboardCtrl', function($scope, $log, mainService, $state){

    $scope.setChartType = function(chartType) {
      $scope.chartType = chartType;

    }

    //drop down
    // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    //create card
    $scope.createCard = (newTitle) => {
        mainService.createCard(newTitle).then(function(response) {
            $scope.readCard();
            $scope.newTitle = "";
        });
    };

      const clear = function() {
        $scope.email = null;
        return alert("email received!");
      }


    $scope.readCard = () => {
        mainService.readCard().then(function(response) {
          $scope.cards = response;
        });
    };
    $scope.readCard();
    // $scope.user = user;

  $scope.getCardByUser = () => {
    mainService.getCardByUser(/*$scope.user._id*/).then(function (results) {
      $scope.userCards = results;
    });
  };

  $scope.deleteCard = (id) => {
    mainService.deleteCard(id).then(function (results) {
      $scope.readCard();
    });
  };
$scope.deleteCard();
$scope.readCard();


// $scope.json_string = "";
//   $scope.fileChanged = (files) => {
//       $scope.isProcessing = true;
//       $scope.sheets = [];
//       $scope.excelFile = files[0];
//       excelReader.readFile($scope.excelFile, true).then(function(xlsxData) {
//           $scope.sheets = xlsxData.sheets;
//           $scope.isProcessing = false;
//       });
//   };
// $scope.updateJSONString = () => {
//   $scope.excelData = $scope.sheets[$scope.selectedSheetName];
//     $scope.excelData = $scope.excelData.data
// }
})


.factory("excelReader", ['$q', '$rootScope',
    function($q, $rootScope) {
        var service = (data) => {
            angular.extend(this, data);
        };
        service.readFile = (file, showPreview) => {
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
 ])
 .controller('excelController', function($scope, excelReader) {
  $scope.json_string = "";
    $scope.fileChanged = (files) => {
        $scope.isProcessing = true;
        $scope.sheets = [];
        $scope.excelFile = files[0];
        excelReader.readFile($scope.excelFile, true).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            $scope.isProcessing = false;
        });
    };
  $scope.updateJSONString = () => {
    $scope.excelData = $scope.sheets[$scope.selectedSheetName];
      $scope.excelData = $scope.excelData.data;
  };
});
