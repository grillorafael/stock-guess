(function() {
    angular.module('stock').controller('UsernameCtrl', UsernameCtrl);

    function UsernameCtrl($scope, StockAPI, $location, $rootScope) {
        $scope.loading = true;
        $scope.hasUsername = false;

        $scope.params = {
            username: ""
        };

        StockAPI.hasUsername().then(function(result) {
            $scope.hasUsername = result.hasUsername;
            $scope.loading = false;
        });

        $scope.save = function() {
            StockAPI.saveUsername($scope.params).then(function(result) {
                if(!result.err) {
                    $location.path('/');
                    $rootScope.hideAlert = true;
                }
                else {
                    $scope.showErrors = true;
                }
            });
        };
    }
})();
