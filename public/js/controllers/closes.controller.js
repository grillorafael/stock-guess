(function() {
    angular.module('stock').controller('ClosesCtrl', ClosesCtrl);

    function ClosesCtrl($scope, StockAPI) {
        $scope.closes = [];

        StockAPI.getCloses().then(function(result) {
            $scope.closes = result;
        });
    }
})();
