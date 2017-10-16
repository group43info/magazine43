var sendMessage = require('../libs/nodemailer');
exports.get = function(req, res) {
  res.render('registration');
};
exports.post = function(req, res) {
  sendMessage();
  res.redirect('../')
};
