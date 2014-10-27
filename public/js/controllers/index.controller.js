(function() {
    angular.module('stock').controller('IndexCtrl', IndexCtrl);
    function IndexCtrl($scope, StockAPI) {
        $scope.guess = {};

        StockAPI.nextAvailableDate().then(function(data) {
            $scope.evaluateDate = data.nextDate;
        });

        StockAPI.getStockToGuess().then(function(guess) {
            if(guess.stockName) {
                $scope.guess = guess;
                plotGraphic();
            }
            else {
                $scope.allSent = true;
            }
        });

        $scope.send = function() {
            console.log($scope.guess);
            StockAPI.send($scope.guess).then(function(result) {
                console.log(result);
                if(!result.error) {
                    $scope.sent = true;
                }
                else {
                    $scope.error = true;
                }
            });
        };

        function plotGraphic() {
            StockAPI.getStockFromTheLast($scope.guess.stockName, 7).then(function(response) {
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



        // $scope.sent = false;
        // $scope.tag = 'stocks_' + $scope.evaluateDate.getTime();
        // var alreadySent = JSON.parse(localStorage.getItem($scope.tag));
        //
        // $scope.stocks = ['AAPL', 'GOOGL', 'FCAP', 'HPQ'];
        // if(alreadySent) {
        //     $scope.stocks = _.filter($scope.stocks, function(item) {
        //         return alreadySent.indexOf(item) == -1;
        //     });
        // }
        //
        // $scope.selected = _.sample($scope.stocks);
        // $scope.setTitle($scope.selected);
        //
        // $scope.sendStock = function(value) {
        //     value = parseFloat(value);
        //     if(isNaN(value)) {
        //         $scope.error = true;
        //     }
        //     else {
        //         $scope.error = false;
        //         $scope.sent = true;
        //         var alreadySent = JSON.parse(localStorage.getItem($scope.tag));
        //         alreadySent = alreadySent ? alreadySent : [];
        //         alreadySent.push($scope.selected);
        //         localStorage.setItem($scope.tag, JSON.stringify(alreadySent));
        //
        //         // TODO: Send value
        //     }
        //     // TODO: Mostrar mensagem ou atualizar tela
        // };
        //
        // if($scope.stocks.length !== 0) {
            // StockAPI.getStockFromTheLast($scope.selected, 7).then(function(response) {
            //     var data = _.map(response.Dates, function(value, index) {
            //         var date = Date.parse(value).getTime();
            //         return [date, response.Elements[0].DataSeries.close.values[index]];
            //     });
            //
            //     $('#container').highcharts('StockChart', {
            //         exporting: {
            //             enabled: false
            //         },
            //         rangeSelector : {
            //             enabled: false
            //         },
            //         navigator:{
            //             enabled: false
            //         },
            //         scrollbar: {
            //             enabled: false
            //         },
            //         title : {
            //             text : $scope.selected + ' Stock Price'
            //         },
            //         series : [{
            //             name : $scope.selected,
            //             data : data,
            //             tooltip: {
            //                 valueDecimals: 2
            //             }
            //         }]
            //     });
            // });
        // }
    }
})();
