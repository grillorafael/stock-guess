angular.module('stock')
    .controller('IndexCtrl', ['$scope', 'StockAPI', function($scope, StockAPI) {
        $scope.sent = false;
        $scope.evaluateDate = Date.today().next().friday();
        $scope.tag = 'stocks_' + $scope.evaluateDate.getTime();
        var alreadySent = JSON.parse(localStorage.getItem($scope.tag));

        $scope.stocks = ['AAPL', 'GOOGL', 'FCAP', 'HPQ'];
        if(alreadySent) {
            $scope.stocks = _.filter($scope.stocks, function(item) {
                return alreadySent.indexOf(item) == -1;
            });
        }

        $scope.selected = _.sample($scope.stocks);
        $scope.setTitle($scope.selected);

        $scope.sendStock = function(value) {
            var value = parseFloat(value);
            if(isNaN(value)) {
                $scope.error = true;
            }
            else {
                $scope.error = false;
                $scope.sent = true;
                var alreadySent = JSON.parse(localStorage.getItem($scope.tag));
                alreadySent = alreadySent ? alreadySent : [];
                alreadySent.push($scope.selected);
                localStorage.setItem($scope.tag, JSON.stringify(alreadySent));

                // TODO: Send value
            }
            // TODO: Mostrar mensagem ou atualizar tela
        };

        if($scope.stocks.length != 0) {
            StockAPI.getStockFromTheLast($scope.selected, 7, function(response) {
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
                        text : $scope.selected + ' Stock Price'
                    },
                    series : [{
                        name : $scope.selected,
                        data : data,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                });
            });
        }
    }]);
