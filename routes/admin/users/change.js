
var mongoose = require('../../../libs/mongoose.js');
exports.get = function(req, res) {
  mongoose.connection.db.collection('users').find().toArray(function(err, docs) {
    if (err) {
      res.sendStatus(500);
    } else {
      // res.render('users_list', {users: docs});
      res.render('admin/users', {users: docs});
    }
  });
}
