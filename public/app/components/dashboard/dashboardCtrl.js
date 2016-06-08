angular.module("domoApp")
.controller('dashboardCtrl', function($scope, $log, mainService, $state, checkAuth){

    $scope.user = checkAuth;
    console.log(checkAuth);
    $scope.card = {};

    $scope.setGraphType = function(graphType) {
      $scope.card.graphType = graphType;
    };

    //drop down
    // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    //create card
    $scope.createCard = (newTitle) => {
        $scope.card.title = newTitle;
        // $scope.card.user = $scope.user._id;
        //$scope.card.dataElement = excel crap
        mainService.createCard($scope.card).then(function(response) {
            $scope.readCard();
            $scope.newTitle = "";
        });
    };
    $scope.sendText = (message) =>{
      var newMessage = {
        to: ["+12406780268"],
        from: "+18013969302",
        message: message
      };
      dashboardService.sendText(newMessage).then(function(response){
        $scope.message = response;
      });
    };
    $scope.sendEmail = (email) => {
          dashboardService.sendEmail({
            toField: $scope.email.toField,
            subjectField: $scope.email.subjectField,
            textField: $scope.email.textField
          }).then(function(response) {
              clear();
              console.log("sendEmail", response);
          });
      };

      const clear = function() {
        $scope.email = null;
        return alert("email received!");
      };


    $scope.readCard = () => {
        dashboardService.readCard().then(function(response) {
          $scope.cards = response;
        });
    };
    $scope.readCard();
    // $scope.user = user;

  $scope.getCardByUser = () => {
    dashboardService.getCardByUser(/*$scope.user._id*/).then(function (results) {
      $scope.userCards = results;
    });
  };

  $scope.deleteCard = (id) => {
    dashboardService.deleteCard(id).then(function (results) {
      $scope.readCard();
    });
  };
$scope.deleteCard();
$scope.readCard();


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
