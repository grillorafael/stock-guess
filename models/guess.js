var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    timestamps = require('mongoose-timestamp'),
    Q = require('q');

var GuessSchema = new Schema({
    score: {
        type: Number,
        default: 0
    },
    stockName: String,
    stockValue: Number,
    _user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

GuessSchema.statics.between = function(date1, date2) {
    var deferred = Q.defer();
    this.find({
        createdAt: {
            $gte: date1,
            $lt: date2
        }
    }).populate('_user').exec(function(err, guesses) {
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else {
            deferred.resolve(guesses);
        }
    });
    return deferred.promise;
};

GuessSchema.statics.averageBetween = function(date1, date2) {
    var deferred = Q.defer();

    this.aggregate({
        $match: {
            createdAt: {
                $gte: date1,
                $lt: date2
            }
        }
    }, {
        $group: {
            _id: '$stockName',
            avgValue: {
                $avg: '$stockValue'
            },
            count: {
                $sum: 1
            }
        }
    }, function(err, results) {
        if(err) {
            deferred.reject(err);
        }
        else {
            var avg = {};
            results.forEach(function(el, index) {
                avg[el._id] = {
                    value: el.avgValue,
                    count: el.count
                };
            });

            deferred.resolve(avg);
        }
    });

    return deferred.promise;
};

GuessSchema.plugin(timestamps);
var Guess = mongoose.model('Guess', GuessSchema);

// TODO: Não pode ser menor que 0

module.exports = Guess;
