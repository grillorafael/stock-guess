var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    timestamps = require('mongoose-timestamp'),
    Q = require('q');

var CloseSchema = new Schema({
    ranked: {
        type: Boolean,
        default: false
    },
    start: Date,
    end: Date,
    values: Schema.Types.Mixed
});

CloseSchema.plugin(timestamps);

CloseSchema.index({
    start: 1,
    end: 1
}, {
    unique: true
});

CloseSchema.statics.getUnranked = function(date1, date2) {
    var deferred = Q.defer();
    this.findOne({
        ranked: false
    }).exec(function(err, close) {
        if(err) {
            deferred.reject(err);
        }
        else {
            if(close === null) {
                deferred.reject(close);
            }
            else {
                deferred.resolve(close);
            }
        }
    });

    return deferred.promise;
};


var Close = mongoose.model('Close', CloseSchema);

module.exports = Close;
