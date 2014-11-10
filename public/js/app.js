(function() {
    angular.module('stock', [
        'ngRoute'
    ])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('_=_');
            $routeProvider
                .when('/', {
                    templateUrl: '/partials/index',
                    controller: 'IndexCtrl'
                })
                .when('/closes', {
                    templateUrl: '/partials/closes',
                    controller: 'ClosesCtrl'
                })
                .when('/terms', {
                    templateUrl: '/partials/terms',
                    controller: 'TermCtrl'
                })
                .when('/me', {
                    templateUrl: '/partials/me',
                    controller: 'MeCtrl'
                })
                .when('/ranking', {
                    templateUrl: '/partials/ranking',
                    controller: 'RankingCtrl'
                })
                .when('/username', {
                    templateUrl: '/partials/username',
                    controller: 'UsernameCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]).
    run(function($rootScope) {
        $rootScope.setTitle = function(title) {
            var prefix = "Stock Guess | ";
            document.title = prefix + title;
        };
    });
})();
