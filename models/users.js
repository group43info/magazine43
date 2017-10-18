
var crypto = require('crypto');
var mongoose = require('../libs/mongoose');
var async = require('async');
var util = require('util');
var ObjectID = require('mongodb').ObjectID;
// var http = require('http');
mongoose.set('debug', true);
var Schema = mongoose.Schema;
var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('SHA256', this.salt).update(password).digest('base64');
};
schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });

schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};
schema.methods.updatePassword = function(newpassword) {
  this.hashedPassword = this.encryptPassword(newpassword);
};
// schema.statics.check = function(oldpassword) {
//   var User = this;
// }
schema.statics.authhorize = function(username, password, callback) {
  var User = this;
  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      // console.log('Session---', req.session);
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError('Password incorect!'));
        }
      } else {
        // callback(new AuthError('Користувач з цією адресою не зареєстрований!'));
        callback(null, user);
      }
    }
  ], callback);
};
schema.statics.recuperation = function(id, newpassword, callback) {
  var User = this;
  User.findOne({_id: ObjectID(id)}, function(err, user) {
    if (err) {
      throw err;
    } else {
      console.log('user');
        user.hashedPassword = user.encryptPassword(newpassword);
        user.save();
        callback(null, user);
    }
  });
};

schema.statics.registration = function(username, password, callback) {
  var User = this;
    User({username: 'admin', password: 'admin'}).save();
  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      // console.log('Session---', req.session);
      if (user) {
        callback(new AuthError('Користувач з цією поштою зареєстрований!'));
      } else {
        user = new User({username: username, password: password});
        user.save(function(err) {
          if (err) {
            return callback(err);
          } callback(null, user);
        });
      }
    }
  ], callback);
};



exports.User = mongoose.model('User', schema);


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);
  this.message = message;
};

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';
exports.AuthError = AuthError;
