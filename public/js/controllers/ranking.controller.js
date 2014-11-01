(function() {
    angular.module('stock').controller('RankingCtrl', RankingCtrl);

    function RankingCtrl($scope, StockAPI) {
        StockAPI.getGlobalRank().then(function(result) {
            $scope.myRank = result.myRank;
            $scope.rank = result.rank;
        });
    }
})();
