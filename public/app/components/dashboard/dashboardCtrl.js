angular.module("domoApp")
    .controller('dashboardCtrl',($scope, $log, dashboardService, $state, user) => {

        (() => {
            dashboardService.getTwitterData({
                    screenName: 'devmtn'
                })
                .then((response) => {
                    $scope.twitterAnalysis = response;
                });
        })();

        $scope.user = user;
        $scope.card = {};

        $scope.setGraphType = (graphType) => {
            $scope.card.graphType = graphType;
            if (graphType === 'barChart') {
                $scope.imageOpacity1 = {
                    opacity: 1
                };
                $scope.imageOpacity2 = {
                    opacity: .1
                };
                $scope.imageOpacity3 = {
                    opacity: .1
                };
                $scope.imageOpacity4 = {
                    opacity: .1
                };
            } else if (graphType === 'scatterPlot') {
                $scope.imageOpacity1 = {
                    opacity: .1
                };
                $scope.imageOpacity2 = {
                    opacity: 1
                };
                $scope.imageOpacity3 = {
                    opacity: .1
                };
                $scope.imageOpacity4 = {
                    opacity: .1
                };
            } else if (graphType === 'pieChart') {
                $scope.imageOpacity1 = {
                    opacity: .1
                };
                $scope.imageOpacity2 = {
                    opacity: .1
                };
                $scope.imageOpacity3 = {
                    opacity: 1
                };
                $scope.imageOpacity4 = {
                    opacity: .1
                };
            } else if (graphType === 'lineGraph') {
                $scope.imageOpacity1 = {
                    opacity: .1
                };
                $scope.imageOpacity2 = {
                    opacity: .1
                };
                $scope.imageOpacity3 = {
                    opacity: .1
                };
                $scope.imageOpacity4 = {
                    opacity: 1
                };
            }
        };

        //create card
        $scope.createCard = (newTitle) => {
            $scope.card.title = newTitle;
            // $scope.card.user = $scope.user._id;
            //$scope.card.dataElement = excel crap
            dashboardService.createCard($scope.card).then((response) => {
                $scope.readCard();
                $scope.newTitle = "";
            });
        };
        $scope.sendText = (message) => {
            let newMessage = {
                to: ["+12406780268"],
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
                clear();
                console.log("sendEmail", response);
            });
        };

        const clear = () => {
            $scope.email = null;
            return alert("email received!");
        };


        $scope.readCard = () => {
            dashboardService.readCard().then((response) => {
                $scope.cards = response;
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

        // twitter view

        // (function() {
        //   dashboardService.getTwitterData({
        //     screenName: 'devmtn'
        //   })
        //     .then(function(response){
        //       $scope.twitterAnalysis = response;
        //       console.log(response);
        //     })
        //   })();
    })

.factory("excelReader", ['$q', '$rootScope',
        ($q, $rootScope) => {
            let service = (data) => {
                angular.extend(this, data);
            };
            service.readFile = (file, showPreview) => {
                let deferred = $q.defer();
                XLSXReader(file, showPreview, (data) => {
                    $rootScope.$apply(() => {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise;
            };
            return service;
        }
    ])
    .controller('excelController', ($scope, excelReader) => {

        $scope.json_string = "";
        $scope.fileChanged = (files) => {
            $scope.isProcessing = true;
            $scope.sheets = [];
            $scope.excelFile = files[0];
            excelReader.readFile($scope.excelFile, true).then((xlsxData) => {
                $scope.sheets = xlsxData.sheets;
                $scope.isProcessing = false;
            });
        };
        $scope.updateJSONString = () => {
            $scope.excelData = $scope.sheets[$scope.selectedSheetName];
            $scope.excelData = $scope.excelData.data;
        };
    });
