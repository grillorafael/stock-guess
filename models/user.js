var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    timestamps = require('mongoose-timestamp');

var UserSchema = new Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    agreed: {
        type: Boolean,
        default: false
    },
    firstPlay: {
        type: Boolean,
        default: true
    },
    gender: String,
    fbId: String,
    fbToken: String,
    email: String,
    name: String,
    score: {
        type: Number,
        default: 0
    }
});
UserSchema.plugin(timestamps);

var User = mongoose.model('User', UserSchema);

User.schema.path('username').validate(function(value) {
    var usernameRegex = /^[a-z0-9_-]{3,16}$/i;
    return usernameRegex.test(value);
}, 'Username must be at least 4 characters and must not contain special characters');

module.exports = User;
