import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import logger from './util/logger';
import passport from 'passport';
import dotenv from 'dotenv';
import passportjwt from 'passport-jwt';
import helmet from 'helmet';

// IMPORTED MIDDLEWARE
import errorMiddleware from './middleware/error.middleware';

// IMPORTED CONTROLLERS
import authController from './controllers/auth.controller';
import refreshController from './controllers/refresh.controller';

// PASSPORT CONFIGS
const opts1: passportjwt.StrategyOptions = {
    secretOrKey: process.env.jwtKey,
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
};

const opts2: passportjwt.StrategyOptions = {
    secretOrKey: process.env.jwtRefresh,
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
};

// CONFIGS
dotenv.config({ path: '.env' });
const app = express();

// STARTING + CONFIGURING THE APP
app.set('port', process.env.PORT || 8080);
app.use(express.json);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

passport.use(
    'jwt-1',
    new passportjwt.Strategy(
        opts1,
        (
            jwt_payload: passportjwt.JwtFromRequestFunction,
            done: passportjwt.VerifiedCallback
        ) => {
            return done(null, jwt_payload);
        }
    )
);
passport.use(
    'jwt-2',
    new passportjwt.Strategy(
        opts2,
        (
            jwt_payload: passportjwt.JwtFromRequestFunction,
            done: passportjwt.VerifiedCallback
        ) => {
            return done(null, jwt_payload);
        }
    )
);

// AUTH ROUTES
app.get(
    '/refresh-token',
    passport.authenticate('jwt-2', { session: false }),
    refreshController
);

app.get('/auth', authController);
app.use(errorMiddleware);

export default app;
