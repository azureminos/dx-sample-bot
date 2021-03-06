/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import path from 'path';

// ===== MESSENGER =============================================================
import ThreadSetup from './messenger-api-helpers/thread-setup';
// import MessengerSetup from './messenger-api-helpers/messenger-setup';

// ===== ROUTES ================================================================
import index from './routes/index';
import webhooks from './routes/webhooks';

// ===== SOCKETS ===============================================================
import attachSockets from './sockets';

/* =============================================
   =                Initialize                 =
   ============================================= */

export const app = express();
const appPort = process.env.PORT;
const demo = process.env.DEMO || false;

console.log(`====> RUNNING ON PORT ${appPort}`);
if (demo) {
  console.log('====> RUNNING IN DEMO MODE');
}

/* =============================================
   =           Basic Configuration             =
   ============================================= */

/* ----------  Views  ---------- */

app.set('view engine', 'ejs');

/* ----------  Static Assets  ---------- */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // eslint-disable-line
app.use(express.static(path.join(__dirname, 'public'))); // eslint-disable-line

/* ----------  Parsers  ---------- */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/* ----------  Loggers &c  ---------- */

app.use(logger('dev'));

/* =============================================
   =                   Sockets                 =
   ============================================= */

/* ----------  Sockets  ---------- */

// Sockets
export const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 20000,
});

attachSockets(io);

/* ----------  Sockets Hooks  ---------- */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(function(req, res, next) {
  res.io = io;
  next();
});

/* =============================================
   =                   Routes                  =
   ============================================= */

/* ----------  Primary / Happy Path  ---------- */

app.use('/', index);
app.use('/webhook', webhooks);

/* ----------  Errors  ---------- */
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    new Error(err); // eslint-disable-line no-new
  });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

/* =============================================
   =              Messenger Setup              =
   ============================================= */

ThreadSetup.domainWhitelisting();
ThreadSetup.persistentMenu();
ThreadSetup.getStartedButton();
// MessengerSetup.setHomeUrl();

/* =============================================
   =            Complete Configuration         =
   ============================================= */

server.listen(appPort, () => console.log(`Listening on ${appPort}`));

export default app;
