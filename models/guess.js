var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    timestamps = require('mongoose-timestamp');

var GuessSchema = new Schema({
    stockName: String,
    stockValue: Number,
    _user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

GuessSchema.plugin(timestamps);
var Guess = mongoose.model('Guess', GuessSchema);
module.exports = Guess;
