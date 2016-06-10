angular.module('domoApp').service('graphService', function($http) {


    this.getData = () => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {"screenName" : "devmtn"}
        }).then(function(response) {
            return response.data;
        });
    };



})
