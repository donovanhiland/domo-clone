const app = angular.module('domoApp');
app.service('mainService', function($http) {

    this.createCard = (newTitle) => {
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
    this.readCard = () => {
        return $http({
            method: "GET",
            url: "/card"
        }).then(function(response) {
            return response.data
        })
    };
    this.getCardByUser = (id) => {
        return $http.get('/card?user=' + id).then(function(response) {
            return response.data
        });
    };
    this.deleteCard = (id) => {
      return $http({
        method: "DELETE",
        url: "/card/" + id
      }).then(function (response) {
        return response.data;
      });
    };

});
app.factory("excelReader", ['$q', '$rootScope',
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
