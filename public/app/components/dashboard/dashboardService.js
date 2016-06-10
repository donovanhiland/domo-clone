angular.module("domoApp").service("dashboardService", function($http){

    this.checkAuth = () => {
        return $http({
            method: 'GET',
            url: '/checkAuth'
        }).then((response) => {
            return response.data;
        });
    };

    this.createCard = (card) => {
        return $http({
            method: "POST",
            url: "/card",
            data: card

        }).then((response) => {
            return response.data;
        });
    };
    this.readCard = () => {
        return $http({
            method: "GET",
            url: "/card"
        }).then((response) => {
            return response.data;
        });
    };
    this.getCardByUser = (id) => {
        return $http.get('/card?user=' + id).then((response) => {
            return response.data;
        });
    };
    this.deleteCard = (id) => {
        return $http({
            method: "DELETE",
            url: "/card/" + id
        }).then((response) => {
            return response.data;
        });
    };

    // alerts (email, text)
    this.sendText = (message) => {
        return $http({
            method: "POST",
            url: "/text",
            data: message
        }).then((response) => {
            return response.data;
        });
    };
    this.sendEmail = (email) => {
        return $http({
            method: "POST",
            url: "/email",
            data: email
        }).then((response) => {
            return response.data;
        });
    };
    // twitter view

<<<<<<< HEAD
    this.getTwitterLineData = (screenname) => {
      return $http({
        method: "POST",
        url: "/tweets/analysis",
        data: screenname
      }).then((response) => {
          return response.data;
      });
    };
    this.getTwitterBarData = () => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {"screenName": "devmtn"}
        }).then((response) => {
            return response.data;
        });
    };
    this.getTwitterData = () => {
=======
    this.getTwitterData = (screenname) => {
>>>>>>> 4a9941ef5fb16b332d0b25b601c26df04758c9a2
      return $http({
        method: "POST",
        url: "/tweets/analysis",
        data: screenname
      }).then((response) => {
          return response.data;
      });
    };
    this.getTwitterBarData = () => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {"screenName": "devmtn"}
        }).then((response) => {
            return response.data;
        });
    };


    this.getCurrentUser = (id) => {
       return $http({
             method: "GET",
             url: "/me",
         }).then((response) => {
             return response.data;
         });
     };

     this.updateUser = (user, newpass) => {
       if (newpass.password) {
         user.password = newpass.password;
       }
       console.log(user);
         return $http({
             method: "PUT",
             url: "/users/" + user._id,
             data: user
         }).then((response) => {
             return response.data;
         });
     };
});
