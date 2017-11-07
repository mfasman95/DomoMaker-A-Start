const chalk = require('chalk');
const { Domo } = require('../models');

// eslint-disable-next-line no-console
const log = console.log;

module.exports.makerPage = (req, res) => {
  res.render('app');
};

module.exports.makeDomo = (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const owner = req.session.account._id;

  return new Domo.DomoModel({ name, age, owner })
  .save()
  .then(() => res.json({ redirect: '/maker' }))
  .catch((err) => {
    log(chalk.red(err));

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
};

module.exports.makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    const domos = docs;

    if (err) {
      log(chalk.red(err));
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(),
      domos,
    });
  });
};
