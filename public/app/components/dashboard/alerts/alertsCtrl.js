angular.module('domoApp').controller('alertsCtrl', function($scope, dashboardService){

  $scope.sendEmail = (email) => {
      dashboardService.sendEmail({
          toField: $scope.email.toField,
          subjectField: $scope.email.subjectField,
          textField: $scope.email.textField
      }).then((response) => {
          clear2();
      });
  };

  const clear2 = () => {
      $scope.email = null;
      return alert("email received!");
  };


  $scope.sendText = (message) => {
      let newMessage = {
          to: ["+12404782587"],
          from: "+18013969302",
          message: message
      };
      dashboardService.sendText(newMessage).then((response) => {
        clear();
          $scope.message = response;

      });
  };
  const clear = () => {
      $scope.text = null;
      return alert("Text received!");
    };
});
