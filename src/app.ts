import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import logger from './util/logger';
import passport from 'passport';

import * as statusController from './controllers/status';

const app = express();
app.set('port', process.env.PORT || 8080);

app.get('/', statusController.hi);
app.post('/awesome', statusController.awesome);

export default app;
