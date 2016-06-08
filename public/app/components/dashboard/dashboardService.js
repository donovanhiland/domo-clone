angular.module('domoApp').service('dashboardService', function($http) {

    this.checkAuth = function() {
        return $http({
            method: 'GET',
            url: '/checkAuth'
        }).then(function(response) {
            return response.data;
        });
    };

    this.createCard = (newTitle) => {
        return $http({
            method: "POST",
            url: "/card",
            data: {
                title: newTitle
            }
        }).then(function(response) {
            return response.data;
        });
    };
    this.readCard = () => {
        return $http({
            method: "GET",
            url: "/card"
        }).then(function(response) {
            return response.data;
        });
    };
    this.getCardByUser = (id) => {
        return $http.get('/card?user=' + id).then(function(response) {
            return response.data;
        });
    };
    this.deleteCard = (id) => {
        return $http({
            method: "DELETE",
            url: "/card/" + id
        }).then(function(response) {
            return response.data;
        });
    };

    // alerts (email, text)
    this.sendText = (message) => {
        return $http({
            method: "POST",
            url: "/text",
            data: message
        }).then(function(response) {
            return response.data;
        });
    };
    this.sendEmail = (email) => {
        console.log(email);
        return $http({
            method: "POST",
            url: "/email",
            data: email
        }).then(function(response) {
            return response.data;
        });
    };
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
]);
