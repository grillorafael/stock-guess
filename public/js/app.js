angular.module('stock', [
    'ngRoute'
])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('!');
            $routeProvider
                .when('/', {
                    templateUrl: '/partials/index',
                    controller: 'IndexCtrl'
                })
                .when('/terms', {
                    templateUrl: '/partials/terms',
                    controller: 'TermCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]).
    service('StockAPI', ['$http',
        function($http) {
            this.getStockFromTheLast = function(name, days, cb) {
                var url =
                    'http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A' +
                    days +
                    '%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' +
                    name +
                    '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D&callback=JSON_CALLBACK';

                $http.jsonp(url).
                success(function(data) {
                    cb(data);
                }).
                error(function(err) {
                    console.log(err);
                });
            };

        }
    ]).
    run(function($rootScope) {
        $rootScope.setTitle = function(title) {
            var prefix = "Stock | ";
            document.title = prefix + title;
        };
    });
