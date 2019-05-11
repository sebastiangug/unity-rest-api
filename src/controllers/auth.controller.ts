import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { default as PassportFacebookToken } from 'passport-facebook-token';
import pGoogle from 'passport-google-oauth';
import pMicrosoft from 'passport-azure-ad';
import pLinkedin from 'passport-linkedin-oauth2';
import jwt, { JwtHeader } from 'jsonwebtoken';
import express from 'express';
import { knex } from '../util/database';
import { DbToken } from '../models/db-token.model';
import logger from '../util/logger';

export type CustomVerifyFunction = PassportFacebookToken.VerifyFunction & {
    profile: {
        dbID: string;
    };
};

export type CustomFacebookProfile = PassportFacebookToken.Profile & {
    dbID: string;
};

export type CustomMSToken = pMicrosoft.ITokenPayload & {
    dbID: string;
};

export type CustomGoogleProfile = pGoogle.Profile & {
    dbID: string;
};

export type CustomLinkedinProfile = pLinkedin.Profile & {
    dbID: string;
};

const router = express();

passport.use(
    'linkedin',
    new pLinkedin.Strategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: process.env.LINKEDIN_CALLBACK_URL
        },
        function(
            accessToken,
            refreshToken,
            profile: CustomLinkedinProfile,
            done
        ) {
            return done(null, profile);
        }
    )
);

passport.use(
    'facebook',
    new PassportFacebookToken(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET
        },
        (accessToken, refreshToken, profile: CustomFacebookProfile, done) => {
            return done(null, profile);
        }
    )
);

passport.use(
    'microsoft',
    new pMicrosoft.BearerStrategy(
        {
            identityMetadata: process.env.MS_IDENTITIY,
            clientID: process.env.MS_CLIENT_ID,
            loggingLevel: 'info',
            allowMultiAudiencesInToken: true,
            validateIssuer: false
        },
        function(token: CustomMSToken, done) {
            return done(null, token);
        }
    )
);

passport.use(
    'google',
    new pGoogle.OAuth2Strategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        function(
            accessToken,
            refreshToken,
            profile: CustomGoogleProfile,
            done
        ) {
            return done(profile);
        }
    )
);

router.get(
    '/social-auth',
    passport.authenticate(['facebook', 'google', 'microsoft', 'linkedin'], {
        session: false
    }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // GETTING TOKENS FOR THE USER FROM DB
            const existingToken = await knex('TOKENS').where({
                user_id: req.user.dbUserID
            });

            const expired = checkIfTokenIsExpired(existingToken);

            if (expired) {
                const refresh_token = jwt.sign(
                    req.user.dbUserID,
                    process.env.jwtREFRESH,
                    {
                        expiresIn: '60',
                        algorithm: 'HS256'
                    }
                );

                knex('TOKENS')
                    .insert({
                        user_id: req.user.dbUserID,
                        token: refresh_token
                    })
                    .then((token: DbToken[]) => {
                        logger.log(
                            'info',
                            'Successfully added token to db for ' +
                                token[0].user_id
                        );
                    })
                    .catch(err => {
                        // you'll want to blacklist this token after;
                        logger.log(
                            'error',
                            'Error adding refresh token to database: ',
                            refresh_token
                        );
                    });
                res.send(refresh_token);
            } else {
                res.send(existingToken);
            }
        } catch (err) {
            next(err);
        }
    }
);

function checkIfTokenIsExpired(token: [{ token: string }]) {
    if (!token) {
        return true;
    } else {
        const decodedToken: any = jwt.decode(token[0].token);
        const rightNow = Date.now();

        if (token[0].token === undefined || token[0].token === null) {
            logger.log('silly', 'TOKEN UNDEFINED/NULL BLOCK FIRING');
            return true;
        } else if (decodedToken.exp > rightNow / 1000) {
            logger.log('silly', 'TOKEN VALID BLOCK FIRING');
            return false;
        } else {
            logger.log('silly', 'TOKEN CHECK DEFAULT BLOCK FIRING? WEIRD.');
            return true;
        }
    }
}

export default router;
