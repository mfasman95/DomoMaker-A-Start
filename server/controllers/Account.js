const chalk = require('chalk');
const { Account } = require('../models');

// eslint-disable-next-line no-console
const log = console.log;

module.exports.loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

module.exports.signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports.login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

module.exports.signup = (request, response) => {
  const req = request;
  const res = response;

  let { username, pass, pass2 } = req.body;

  username = `${username}`;
  pass = `${pass}`;
  pass2 = `${pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(pass, (salt, hash) => {
    const password = hash;

    // Make the new account
    const newAccount = new Account.AccountModel({ username, salt, password });
    // Save the new account
    newAccount.save()
    // After the save, return a response
    .then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    })
    // If an error occurs, handle it
    .catch((err) => {
      log(chalk.red(err));

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
