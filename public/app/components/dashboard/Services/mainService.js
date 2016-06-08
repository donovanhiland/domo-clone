angular.module("domoApp")
.service('mainService', function($http) {

    this.createCard = (card) => {
        return $http({
            method: "POST",
            url: "/card",
            data: card

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
      }).then(function (response) {
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
});
