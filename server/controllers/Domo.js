const chalk = require('chalk');
const { Domo } = require('../models');

// eslint-disable-next-line no-console
const log = console.log;

module.exports.makerPage = (req, res) => {
  res.render('app');
};

module.exports.makeDomo = (req, res) => {
  const { name, age, memeScore } = req.body;

  if (!name || !age || !memeScore) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const owner = req.session.account._id;

  return new Domo.DomoModel({ name, age, memeScore, owner })
  .save()
  .then(() => res.json({ redirect: '/maker' }))
  .catch((err) => {
    log(chalk.red(err));

    const errString = err.toString();
    if (errString.includes('memeScore')) {
      if (errString.includes('more than maximum allowed value')) {
        return res.status(400).json({ error: 'The Meme Scores Are Too Damn High' });
      } else if (errString.includes('less than minimum allowed value')) {
        return res.status(400).json({ error: 'That Meme Score is TOO sad' });
      }
    }

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
};

module.exports.deleteDomo = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'RAWR! That domo cannot be deleted' });
  }

  return Domo.DomoModel.remove({ _id: id })
    .then(() => res.json({ redirect: '/maker' }))
    .catch((err) => {
      log(chalk.red(err));

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

module.exports.getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      log(chalk.red(err));
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};
