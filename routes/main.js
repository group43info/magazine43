
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function (req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.send('Not Found');
  } else {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      // var user = doc;
      res.render('index', {user: doc});
    });
  }
};
