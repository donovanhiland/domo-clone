angular.module("domoApp").service("graphService", function($http){

    // twitter view

    this.getTwitterBarData = (screenName) => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {
              screenName: screenName
            }
        }).then((response) => {
            return response.data;
        });
    };
    this.getTwitterLineData = (screenName) => {
      console.log(screenName);
      return $http({
        method: "POST",
        url: "/tweets/analysis",
        data: {
          screenName: screenName
        }
      }).then((response) => {
          return response.data;
      });
    };




});
