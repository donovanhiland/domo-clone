angular.module("domoApp")
    .controller('dashboardCtrl', function($scope, $log, dashboardService, $state, user, $http) {

        $scope.user = user;
        (function(screenName) {
          dashboardService.getTwitterData({
            screenName: screenName
          })
          .then(function (response) {
            $scope.twitterAnalysis = response;
          });
        })(user.screenName);
        $scope.card = {};

        $scope.setGraphType = (graphType) => {
            $scope.card.graphType = graphType;
            if (graphType === 'barChart') {
                $scope.imageOpacity1 = {opacity: 1};
                $scope.imageOpacity2 = {opacity: 0.1};
                $scope.imageOpacity3 = {opacity: 0.1};
                $scope.imageOpacity4 = {opacity: 0.1};
            } else if (graphType === 'scatterPlot') {
                $scope.imageOpacity1 = {opacity: 0.1};
                $scope.imageOpacity2 = {opacity: 1};
                $scope.imageOpacity3 = {opacity: 0.1};
                $scope.imageOpacity4 = {opacity: 0.1};
            } else if (graphType === 'pieChart') {
                $scope.imageOpacity1 = {opacity: 0.1};
                $scope.imageOpacity2 = {opacity: 0.1};
                $scope.imageOpacity3 = {opacity: 1};
                $scope.imageOpacity4 = {opacity: 0.1};
            } else if (graphType === 'lineGraph') {
                $scope.imageOpacity1 = {opacity: 0.1};
                $scope.imageOpacity2 = {opacity: 0.1};
                $scope.imageOpacity3 = {opacity: 0.1};
                $scope.imageOpacity4 = {opacity: 1};
            }
        };

        //Excel uploader
        var formdata = new FormData();
         $scope.getTheFiles = function ($files) {
             angular.forEach($files, function (value, key) {
                 formdata.append(key, value);
             });
         };

        //create card
        $scope.createCard = (newTitle) => {
            $scope.card.title = newTitle;
            // $scope.card.user = $scope.user._id;
            $scope.card.dataElement = $scope.getTheFiles();
            dashboardService.createCard($scope.card).then((response) => {
                $scope.readCard();
                $scope.newTitle = "";
            });
        };
        $scope.sendText = (message) => {
            let newMessage = {
                to: ["+12404782587"],
                from: "+18013969302",
                message: message
            };
            dashboardService.sendText(newMessage).then((response) => {
                $scope.message = response;
            });
        };
        $scope.sendEmail = (email) => {
            dashboardService.sendEmail({
                toField: $scope.email.toField,
                subjectField: $scope.email.subjectField,
                textField: $scope.email.textField
            }).then((response) => {
                clear2();
            });
        };

        const clear2 = () => {
            $scope.email = null;
            return alert("email received!");
        };


        $scope.readCard = () => {
            dashboardService.readCard().then((response) => {
                $scope.cards = response;
            });
        };
        $scope.logout = () => {
                    dashboardService.logout()
                        .then(function(response) {
                            $state.go('home');
                        });
                };
        $scope.readCard();
        // $scope.user = user;

        $scope.getCardByUser = () => {
            dashboardService.getCardByUser( /*$scope.user._id*/ ).then((results) => {
                $scope.userCards = results;
            });
        };

        $scope.deleteCard = (id) => {
            dashboardService.deleteCard(id).then((results) => {
                $scope.readCard();
            });
        };
        $scope.deleteCard();
        $scope.readCard();



          //  $scope.uploadFiles = function () {
          //    var request = {
          //           method: 'POST',
          //           url: '/card',
          //           data: formdata,
          //           headers: {
          //               'Content-Type': undefined
          //           }
          //       };
          //       // SEND THE FILES.
          //       $http(request)
          //           .success(function (d) {
          //               alert(d);
          //           })
          //           .error(function () {
          //           });
          //  };
           $scope.getTheFiles = function ($files) {
                console.log($files);
            };

   })
   .directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            }

            return {
                link: fn_link
            };
        }]);
