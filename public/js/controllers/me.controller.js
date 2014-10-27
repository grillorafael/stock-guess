(function() {
    angular.module('stock').controller('MeCtrl', MeCtrl);

    function MeCtrl($scope, StockAPI) {
        $scope.guesses = [];

        StockAPI.me().then(function(guesses) {
            $scope.guesses = guesses;
        });
    }
})();
