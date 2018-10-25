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
import SocketServer from 'socket.io';
import {Server} from 'http';

// ===== MESSENGER =============================================================
import ThreadSetup from './messenger-api-helpers/thread-setup';
import MessengerSetup from './messenger-api-helpers/messenger-setup';

// ===== ROUTES ================================================================
import index from './routes/index';
import lists from './routes/lists';
import promos from './routes/promos';
import webhooks from './routes/webhooks';
import region from './routes/region';
import country from './routes/country';
import city from './routes/city';
import attraction from './routes/attraction';
import pkg from './routes/package';
import pkgItem from './routes/package-item';
import ratePlan from './routes/rate-plan';
import packageInstance from './routes/package-instance';
import instanceParticipant from './routes/package-instance-participant';
import instRoute from './routes/instance';

// ===== SOCKETS ===============================================================
import attachSockets from './sockets';

/* =============================================
   =                Initialize                 =
   ============================================= */

export const app = express();
const appPort = process.env.PORT;
const demo = process.env.DEMO || false;

if (demo) { console.log('====> RUNNING IN DEMO MODE'); }

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
export const server = Server(app);
const io = new SocketServer(server, {pingInterval: 2000, pingTimeout: 5000});

attachSockets(io);

/* ----------  Sockets Hooks  ---------- */

app.use(function(req, res, next) {
  res.io = io;
  next();
});

/* =============================================
   =                   Routes                  =
   ============================================= */

/* ----------  Primary / Happy Path  ---------- */

app.use('/', index);
app.use('/lists', lists);
app.use('/webhook', webhooks);
app.use('/promos', promos);
app.use('/region', region);
app.use('/country', country);
app.use('/city', city);
app.use('/attraction', attraction);
app.use('/package', pkg);
app.use('/packageItem', pkgItem);
app.use('/ratePlan', ratePlan);
app.use('/packageInstance', packageInstance);
app.use('/instanceParticipant', instanceParticipant);
app.use('/instance', instRoute);

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
MessengerSetup.setHomeUrl();

/* =============================================
   =            Complete Configuration         =
   ============================================= */

server.listen(appPort);

export default app;
