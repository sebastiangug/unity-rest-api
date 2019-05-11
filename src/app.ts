import express from 'express';
import bodyParser from 'body-parser';
import logger from './util/logger';
import passport from 'passport';
import dotenv from 'dotenv';
import passportjwt from 'passport-jwt';
import cors from 'cors';
dotenv.config({ path: '.env' });

// IMPORTED MIDDLEWARE
import errorMiddleware from './middleware/error.middleware';

// IMPORTED CONTROLLERS
import authController from './controllers/auth.controller';
import refreshController from './controllers/refresh.controller';
import playgroundController from './controllers/playground.controller';

// PASSPORT CONFIGS
// ACCESS TOKEN OPTS
const opts1: passportjwt.StrategyOptions = {
    secretOrKey: process.env.jwtKey,
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
};
// REFRESH TOKEN OPTS
const opts2: passportjwt.StrategyOptions = {
    secretOrKey: process.env.jwtRefresh,
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
};

// CONFIGS

const app = express();

// STARTING + CONFIGURING THE APP
app.set('port', process.env.PORT || 8080);
app.use(cors({ origin: [process.env.CORS_ORIGIN1, process.env.CORS_ORIGIN2] }));
app.use(express.json());
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

// REFRESH TOKEN STRATEGY
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
app.use('/playground', playgroundController);
app.use(errorMiddleware);

export default app;
