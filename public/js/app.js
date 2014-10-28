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
