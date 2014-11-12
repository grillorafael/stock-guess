(function() {
    angular.module('stock').controller('IndexCtrl', IndexCtrl);
    function IndexCtrl($scope, StockAPI, $timeout) {
        $scope.guess = {};

        StockAPI.nextAvailableDate().then(function(data) {
            $scope.evaluateDate = data.nextDate;
        });

        loadNextGuess();
        function loadNextGuess() {
            StockAPI.getStockToGuess().then(function(guess) {
                if(guess.stockName) {
                    $scope.guess = guess;
                    plotGraphic();

                    $scope.allSent = false;
                    $scope.sent = false;
                    checkFirstPlay();
                }
                else {
                    StockAPI.getBonusStockToGuess().then(function(guess) {
                        if(guess.stockName) {
                            $scope.guess = guess;
                            plotGraphic();

                            $scope.isBonus = true;
                            $scope.allSent = false;
                            $scope.sent = false;
                        }
                        else {
                            $scope.allSent = true;
                        }
                    });
                }
            });
        }

        function checkFirstPlay() {
            StockAPI.getFirstPlay().then(function(user) {
                if(user.firstPlay) {
                    $timeout(function() {
                        var tour = new Tour({
                            onEnd: function (tour) {
                                StockAPI.setFirstPlay().then(function(user) {
                                    console.log(user);
                                });
                            },
                            steps: [
                            {
                                element: "#container",
                                title: "Analyse",
                                content: "Evaluate the stock history"
                            },
                            {
                                element: "#evaluateDate",
                                title: "Evaluate",
                                content: "Think about the value of the stock in a given date"
                            },
                            {
                                element: ".input-group",
                                title: "Type your guess",
                                content: "Type your guess and share with the world how good you are."
                            }]
                        });

                        // tour.init();
                        // tour.start(true);
                    });
                }
            });
        }

        $scope.loadNextGuess = loadNextGuess;
        $scope.send = function() {
            console.log($scope.guess);
            StockAPI.send($scope.guess).then(function(result) {
                console.log(result);
                if(!result.error) {
                    $scope.sent = true;
                    StockAPI.getStockToGuess().then(function(guess) {
                        if(!guess.stockName) {
                            StockAPI.getBonusStockToGuess().then(function(guess) {
                                if(guess.stockName) {
                                    $scope.hasBonus = true;
                                }
                            });
                        }
                    });
                }
                else {
                    $scope.error = true;
                }
            });
        };

        function plotGraphic() {
            StockAPI.getStockFromTheLast($scope.guess.stockName, 10).then(function(response) {
                var data = _.map(response.Dates, function(value, index) {
                    var date = Date.parse(value).getTime();
                    return [date, response.Elements[0].DataSeries.close.values[index]];
                });

                $('#container').highcharts('StockChart', {
                    exporting: {
                        enabled: false
                    },
                    rangeSelector : {
                        enabled: false
                    },
                    navigator:{
                        enabled: false
                    },
                    scrollbar: {
                        enabled: false
                    },
                    title : {
                        text : $scope.guess.stockName + ' Stock Price'
                    },
                    series : [{
                        name : $scope.guess.stockName,
                        data : data,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                });
            });
        }
    }
})();
