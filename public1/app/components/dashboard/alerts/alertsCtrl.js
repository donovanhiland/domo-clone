angular.module('domoApp').controller('alertsCtrl', function($scope, mainService){

  $scope.sendEmail = (email) => {
        mainService.sendEmail({
          toField: $scope.email.toField,
          subjectField: $scope.email.subjectField,
          textField: $scope.email.textField
        }).then(function(response) {
            clear();
            console.log("sendEmail", response);
        });
    };

});
