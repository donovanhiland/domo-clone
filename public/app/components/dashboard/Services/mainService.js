angular.module('domoApp').service('mainService', function($http) {

this.createCard = function(newTitle) {
        return $http({
            method: "POST",
            url: "/card",
            data: {
                title: newTitle
            }
        }).then(function(response) {
            return response.data
        })
    };
});
