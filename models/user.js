var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    timestamps = require('mongoose-timestamp');

var UserSchema = new Schema({
    username: String,
    gender: String,
    fbId: String,
    fbToken: String,
    email: String,
    name: String
});
UserSchema.plugin(timestamps);
var User = mongoose.model('User', UserSchema);
module.exports = User;
