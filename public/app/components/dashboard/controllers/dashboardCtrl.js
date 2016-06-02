angular.module('domoApp')
.controller('dashboardCtrl', function($scope, $log, checkAuth, mainService, $state, $timeout){


    //drop down
    // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    //create card
    $scope.createCard = function(newTitle) {
        console.log("working");
        mainService.createCard(newTitle).then(function(response) {
            $scope.readCard();
        });
    };
    $scope.readCard = function() {
        mainService.readCard().then(function(response) {
          $scope.cards = response;
        });
    };
    $scope.readCard();
    // $scope.user = user;

  $scope.getCardByUser = function () {
    mainService.getCardByUser(/*$scope.user._id*/).then(function (results) {
      $scope.userCards = results;
    });
  };

});
