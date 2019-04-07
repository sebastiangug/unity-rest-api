import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { default as PassportFacebookToken } from 'passport-facebook-token';
import pGoogle from 'passport-google-oauth2';
import pMicrosoft from 'passport-azure-ad';
import pLinkedin from 'passport-linkedin-oauth2';
import jwt from 'jsonwebtoken';
import express from 'express';
import { knex } from '../util/database';
import { USERS } from '../models/database.model';
import { User } from './../models/user.model';

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

export type CustomGoogleProfile = pGoogle.VerifyFunction & {
    profile: {
        dbID: string;
    };
};

const routes = express();

passport.use(
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
    new pGoogle.Strategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done): pGoogle. {
            knex.select(USERS.id, USERS.is_onboarded, USERS.microsoft_id)
                .where({ email: profile. })
                .from(USERS.table)
                .then((users: User[]) => {
                    
                    profile.dbID = users[0].id;

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

export default routes;
