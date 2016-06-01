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
    this.readCard = function() {
        return $http({
            method: "GET",
            url: "/card"
        }).then(function(response) {
            return response.data
        })
    };
    this.getCardByUser = function(id) {
        return $http.get('/card?user=' + id).then(function(response) {
            return response.data
        });
    };

});
