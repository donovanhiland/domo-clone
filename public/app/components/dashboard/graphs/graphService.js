angular.module("domoApp").service("graphService", function($http){

    // twitter view

    this.getTwitterBarData = () => {
        return $http({
            method: "POST",
            url: "/tweets/engagement",
            data: {"screenName": "devmtn"}
        }).then((response) => {
            return response.data;
        });
    };
    this.getTwitterLineData = () => {
      return $http({
        method: "POST",
        url: "/tweets/analysis",
        data: {"screenName": "devmtn"}
      }).then((response) => {
          return response.data;
      });
    };

    this.getExcel = () => {
      return $http({
        method: "GET",
        url: "/card"
      }).then((response) => {
        return response.data;
      });
    };

    this.createExcel = (file) => {
      return $http({
        method: "POST",
        url: "/card",
        data: file
      }).then((response) => {
        return response.data;
      });
    };


});
