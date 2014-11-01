(function() {
    angular.module('stock').factory('StockAPI', StockAPI);

    function StockAPI($http, $q) {
        function getStockFromTheLast(name, days) {
            var deferred = $q.defer();
            var url =
                'http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A' +
                days +
                '%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' +
                name +
                '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D&callback=JSON_CALLBACK';

            $http.jsonp(url).
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function send(guess) {
            var deferred = $q.defer();
            $http.post('/api/guess', guess)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function nextAvailableDate() {
            var deferred = $q.defer();
            $http.get('/api/guess/nextDate')
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getStockToGuess() {
            var deferred = $q.defer();
            $http.get('/api/guess/choice/avaliable')
                .success(function(guess) {
                    deferred.resolve(guess);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function me() {
            var deferred = $q.defer();
            $http.get('/api/guess/me')
                .success(function(guesses) {
                    deferred.resolve(guesses);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function saveUsername(params) {
            var deferred = $q.defer();
            $http.post('/api/guess/username', params)
                .success(function(result) {
                    deferred.resolve(result);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function hasUsername() {
            var deferred = $q.defer();
            $http.get('/api/guess/has/username')
                .success(function(result) {
                    deferred.resolve(result);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getGlobalRank() {
            var deferred = $q.defer();
            $http.get('/api/guess/global/score')
                .success(function(result) {
                    deferred.resolve(result);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        return {
            getStockFromTheLast: getStockFromTheLast,
            send: send,
            nextAvailableDate: nextAvailableDate,
            getStockToGuess: getStockToGuess,
            me: me,
            saveUsername: saveUsername,
            hasUsername: hasUsername,
            getGlobalRank: getGlobalRank
        };
    }
})();
