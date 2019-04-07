import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { default as PassportFacebookToken } from 'passport-facebook-token';
import pGoogle from 'passport-google-oauth';
import pMicrosoft from 'passport-azure-ad';
import pLinkedin from 'passport-linkedin-oauth2';
import jwt, { JwtHeader } from 'jsonwebtoken';
import express from 'express';
import { knex } from '../util/database';
import { USERS } from '../models/database.model';
import { User } from './../models/user.model';
import request from 'request-promise';
import { DbToken } from 'src/models/db-token.model';

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
            knex.select(USERS.id, USERS.is_onboarded, USERS.linkedin_id)
                .where({ email: profile.emails[0].value })
                .from(USERS.table)
                .then((users: User[]) => {
                    profile.dbID = users[0].id;

                    // IF USER IS NOT SIGNED UP WE WILL UPDATE STUFF  AND CHANGE signed_up from null to true (1)
                    if (users.length === 1 && users[0].is_onboarded === null) {
                        knex(USERS.table)
                            .update({
                                is_onboarded: 1
                            })
                            .where({ email: profile.emails[0].value })
                            .then(() => {
                                return;
                            });
                    }

                    // IF USER'S EMAIL MATCHES + THE FB ID IS ALREADY REGISTERED
                    if (
                        users.length === 1 &&
                        users[0].linkedin_id === profile.id
                    ) {
                        return done(null, profile);
                    }

                    // IF THE EMAIL MATCHES BUT FB ID IS NULL, ADD THE ID TO DB FOR NEXT TIME
                    else if (
                        users.length === 1 &&
                        users[0].linkedin_id === null
                    ) {
                        knex(USERS.table)
                            .update({
                                linkedin_id: profile.id
                            })
                            .where({ email: profile.emails[0].value })
                            .then(user => {
                                return done(null, profile);
                            })
                            .catch(error => {
                                return done(null, profile);
                            });
                    }
                    // IF AN EMAIL MATCH IS FOUND BUT THE FB ID ALREADY EXISTS AND DOESN'T MATCH THE USER'S PROFILE
                    else if (
                        users.length === 1 &&
                        users[0].linkedin_id !== null &&
                        users[0].linkedin_id !== profile.id
                    ) {
                        const error = new Error(
                            'The facebook profile does not match the email address we have registered for your account'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }

                    // IF WE CAN'T FIND ANY USER/ANY MATCH IN THE DB
                    else if (users.length === 0) {
                        let error = new Error(
                            'You have not been invited to any organization yet.'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }
                    // THIS SHOULDN'T REALLY EVER HAPPEN BUT I GUESS I SHOULD THROW/HANDLE THE ERROR HERE
                    else {
                        let error = new Error();
                        return done(error);
                    }
                });
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
            knex.select(USERS.id, USERS.is_onboarded, USERS.facebook_id)
                .where({ email: profile.emails[0].value })
                .from(USERS.table)
                .then((users: User[]) => {
                    profile.dbID = users[0].id;

                    // IF USER IS NOT SIGNED UP WE WILL UPDATE STUFF  AND CHANGE signed_up from null to true (1)
                    if (users.length === 1 && users[0].is_onboarded === null) {
                        knex(USERS.table)
                            .update({
                                is_onboarded: 1
                            })
                            .where({ email: profile.emails[0].value })
                            .then(() => {
                                return;
                            });
                    }

                    // IF USER'S EMAIL MATCHES + THE FB ID IS ALREADY REGISTERED
                    if (
                        users.length === 1 &&
                        users[0].facebook_id === profile.id
                    ) {
                        return done(null, profile);
                    }

                    // IF THE EMAIL MATCHES BUT FB ID IS NULL, ADD THE ID TO DB FOR NEXT TIME
                    else if (
                        users.length === 1 &&
                        users[0].facebook_id === null
                    ) {
                        knex(USERS.table)
                            .update({
                                facebook_id: profile.id
                            })
                            .where({ email: profile.emails[0].value })
                            .then(user => {
                                return done(null, profile);
                            })
                            .catch(error => {
                                return done(null, profile);
                            });
                    }
                    // IF AN EMAIL MATCH IS FOUND BUT THE FB ID ALREADY EXISTS AND DOESN'T MATCH THE USER'S PROFILE
                    else if (
                        users.length === 1 &&
                        users[0].facebook_id !== null &&
                        users[0].facebook_id !== profile.id
                    ) {
                        const error = new Error(
                            'The facebook profile does not match the email address we have registered for your account'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }

                    // IF WE CAN'T FIND ANY USER/ANY MATCH IN THE DB
                    else if (users.length === 0) {
                        let error = new Error(
                            'You have not been invited to any organization yet.'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }
                    // THIS SHOULDN'T REALLY EVER HAPPEN BUT I GUESS I SHOULD THROW/HANDLE THE ERROR HERE
                    else {
                        let error = new Error();
                        return done(error);
                    }
                });
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
            knex.select(USERS.id, USERS.is_onboarded, USERS.microsoft_id)
                .where({ email: token.upn })
                .from(USERS.table)
                .then((users: User[]) => {
                    token.dbID = users[0].id;

                    // IF USER IS NOT SIGNED UP WE WILL UPDATE STUFF  AND CHANGE signed_up from null to true (1)
                    if (users.length === 1 && users[0].is_onboarded === null) {
                        knex(USERS.table)
                            .update({
                                is_onboarded: 1
                            })
                            .where({ email: token.upn })
                            .then(() => {
                                return;
                            });
                    }

                    // IF USER'S EMAIL MATCHES + THE FB ID IS ALREADY REGISTERED
                    if (
                        users.length === 1 &&
                        users[0].microsoft_id === token.oid
                    ) {
                        return done(null, token);
                    }

                    // IF THE EMAIL MATCHES BUT FB ID IS NULL, ADD THE ID TO DB FOR NEXT TIME
                    else if (
                        users.length === 1 &&
                        users[0].facebook_id === null
                    ) {
                        knex(USERS.table)
                            .update({
                                microsoft_id: token.oid
                            })
                            .where({ email: token.upn })
                            .then(user => {
                                return done(null, token);
                            })
                            .catch(error => {
                                return done(null, token);
                            });
                    }
                    // IF AN EMAIL MATCH IS FOUND BUT THE FB ID ALREADY EXISTS AND DOESN'T MATCH THE USER'S PROFILE
                    else if (
                        users.length === 1 &&
                        users[0].microsoft_id !== null &&
                        users[0].microsoft_id !== token.oid
                    ) {
                        const error = new Error(
                            'The Microsoft profile does not match the email address we have registered for your account'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }

                    // IF WE CAN'T FIND ANY USER/ANY MATCH IN THE DB
                    else if (users.length === 0) {
                        let error = new Error(
                            'You have not been invited to any organization yet.'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }
                    // THIS SHOULDN'T REALLY EVER HAPPEN BUT I GUESS I SHOULD THROW/HANDLE THE ERROR HERE
                    else {
                        let error = new Error();
                        return done(error);
                    }
                });
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
            knex.select(USERS.id, USERS.is_onboarded, USERS.google_id)
                .where({ email: profile.emails[0].value })
                .from(USERS.table)
                .then((users: User[]) => {
                    profile.dbID = users[0].id;

                    // IF USER IS NOT SIGNED UP WE WILL UPDATE STUFF  AND CHANGE signed_up from null to true (1)
                    if (users.length === 1 && users[0].is_onboarded === null) {
                        knex(USERS.table)
                            .update({
                                is_onboarded: 1
                            })
                            .where({ email: profile.emails[0].value })
                            .then(() => {
                                return;
                            });
                    }

                    // IF USER'S EMAIL MATCHES + THE FB ID IS ALREADY REGISTERED
                    if (
                        users.length === 1 &&
                        users[0].google_id === profile.id
                    ) {
                        return done(null, profile);
                    }

                    // IF THE EMAIL MATCHES BUT FB ID IS NULL, ADD THE ID TO DB FOR NEXT TIME
                    else if (
                        users.length === 1 &&
                        users[0].google_id === null
                    ) {
                        knex(USERS.table)
                            .update({
                                google_id: profile.id
                            })
                            .where({ email: profile.emails[0].value })
                            .then(user => {
                                return done(null, profile);
                            })
                            .catch(error => {
                                return done(null, profile);
                            });
                    }
                    // IF AN EMAIL MATCH IS FOUND BUT THE FB ID ALREADY EXISTS AND DOESN'T MATCH THE USER'S PROFILE
                    else if (
                        users.length === 1 &&
                        users[0].google_id !== null &&
                        users[0].google_id !== profile.id
                    ) {
                        const error = new Error(
                            'The Google profile does not match the email address we have registered for your account'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }

                    // IF WE CAN'T FIND ANY USER/ANY MATCH IN THE DB
                    else if (users.length === 0) {
                        let error = new Error(
                            'You have not been invited to any organization yet.'
                        );
                        error.name = 'not-signed-up';
                        return done(error);
                    }
                    // THIS SHOULDN'T REALLY EVER HAPPEN BUT I GUESS I SHOULD THROW/HANDLE THE ERROR HERE
                    else {
                        let error = new Error();
                        return done(error);
                    }
                });
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
            // ADDING USER PHOTO TO DB FROM LINK
            request.get(req.user._json.photo, function(
                err: any,
                res: any,
                body: any
            ) {
                knex(USERS.table)
                    .update({ photo: body })
                    .where({ id: req.user.dbUserID })
                    .then(() => {
                        console.log('PHOTO UPDATED');
                    })
                    .catch(err => {
                        console.log('ERROR ADDING PHOTO TO DATABASE');
                    });
            });

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
                        console.log('SUCCESSFULLY ADDED TOKEN TO DB');
                        console.log(token);
                    })
                    .catch(err => {
                        console.log('ERROR ADDING TOKEN TO DB');
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
    const decodedToken: any = jwt.decode(token[0].token);
    const rightNow = Date.now();
    console.log(rightNow / 1000);
    console.log(decodedToken.exp);

    if (token[0].token === undefined || token[0].token === null) {
        console.log('TOKEN UNDEFINED');
        return true;
    } else if (decodedToken.exp > rightNow / 1000) {
        console.log('TOKEN VALID');
        return false;
    } else {
        console.log('TOKEN EXPIRED');
        return true;
    }
}

export default router;
