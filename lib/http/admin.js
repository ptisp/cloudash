module.exports = function(req, res, next) {
  if (req.user.type !== 'admin') {
    return res.status(401).json({
      'result': 'nok',
      'message': 'access denied'
    });
  }
  next();
};
