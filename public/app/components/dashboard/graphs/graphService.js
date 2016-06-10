angular.module('domoApp').service('graphService', function($http) {


    this.getTwitterData = () => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {"screenName" : "devmtn"}
        }).then(function(response) {
            return response.data;
        });
    };

    // this.getInstaData = () => {
    //     return $http({
    //         method: "POST",
    //         url: "/tweets/engagement",
    //         data: {"screenName" : "devmtn"}
    //     }).then(function(response) {
    //         return response.data;
    //     });
    // };



})
