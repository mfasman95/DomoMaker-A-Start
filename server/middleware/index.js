module.exports.requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

module.exports.requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};

// The requiresSecure function depends on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return res.next();
  };
} else {
  module.exports.requiresSecure = (req, res, next) => next();
}
