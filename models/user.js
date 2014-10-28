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
    gender: String,
    fbId: String,
    fbToken: String,
    email: String,
    name: String
});
UserSchema.plugin(timestamps);

var User = mongoose.model('User', UserSchema);

User.schema.path('username').validate(function(value) {
    var usernameRegex = /^[a-z0-9_-]{3,16}$/;
    return usernameRegex.test(value);
}, 'Username must be at least 4 characters and must not contain special characters');

module.exports = User;
