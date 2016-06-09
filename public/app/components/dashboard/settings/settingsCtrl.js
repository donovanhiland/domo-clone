angular.module('domoApp').controller('settingsCtrl', function($scope, dashboardService) {
    $scope.getCurrentUser = function() {
        dashboardService.getCurrentUser().then(function(response) {
            if (!response) {
                $state.go('Signin');
            }
            $scope.user = response;
        }).catch(function(err) {
            $state.go('Signin');
        });
    };
    $scope.newpass = {};

    $scope.getCurrentUser();
    $scope.updateUser = function() {
        dashboardService.updateUser($scope.user, $scope.newpass).then(function(response) {
            $scope.getCurrentUser();
              alert('Profile Updated!');
        });
    };
});
