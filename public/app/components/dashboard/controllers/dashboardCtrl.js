angular.module('domoApp').controller('dashboardCtrl', function($scope, $log, mainService, $state){
  
  //drop down
  // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  //create card
  $scope.createCard = function () {
        mainService.createCard($scope.newTitle).then(function (response) {
          console.log("createCard", response);
          // $state.go("card",{id:response._id})
        })

    };

});
