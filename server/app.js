// node js modules
const path = require('path');

// imported modules
const mongoose = require('mongoose');
const chalk = require('chalk');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlerbars = require('express-handlebars');
const session = require('express-session');

// custom modules
const router = require('./router');

// eslint-disable-next-line no-console
const log = console.log;

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

mongoose.connect(dbURL, {
  useMongoClient: true,
}, (err) => {
  if (err) {
    log(chalk.red('Could not connect to database'));
    throw err;
  }
});

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
}));
app.engine('handlebars', expressHandlerbars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
  if (err) throw err;

  log(chalk.cyan(`Listening on port ${port}`));
});
