
var mongoose = require('../../libs/mongoose.js');
exports.get = function(req, res) {
  mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
    if (err) throw err;
    res.render('admin/discipline', {discipline: docs});
  });
};
