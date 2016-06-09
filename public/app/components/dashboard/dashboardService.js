angular.module('domoApp').service('dashboardService', function($http) {

    this.checkAuth = function() {
        return $http({
            method: 'GET',
            url: '/checkAuth'
        }).then(function(response) {
            return response.data;
        });
    };

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
        return $http({
            method: "POST",
            url: "/email",
            data: email
        }).then(function(response) {
            return response.data;
        });
    };
    this.getCurrentUser = function(id) {
       return $http({
             method: "GET",
             url: "/me",
         }).then(function(response) {
             return response.data;
         });
     };
     this.updateUser = function(user, newpass) {
       if (newpass.password) {
         user.password = newpass.password;
       }
       console.log(user);
         return $http({
             method: "PUT",
             url: "/users/" + user._id,
             data: user
         }).then(function(response) {
             return response.data;
         });
     };
});
