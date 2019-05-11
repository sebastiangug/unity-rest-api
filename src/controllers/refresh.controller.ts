import express from 'express';
import { knex } from '../util/database';
const router = express.Router();
import jwt from 'jsonwebtoken';
import logger from '../util/logger';

router.post('', async (req, res, next) => {
    try {
        const user = await getUser();
        const token = jwt.sign(user, process.env.jwtKey, {
            expiresIn: '900s',
            algorithm: 'HS256'
        });
        res.send(token);
    } catch (err) {
        logger.log('error', err.toString());
        err.name = 'database';
        next(err);
    }

    function getUser() {
        return knex.transaction(async function(trx) {
            const permissionsArray = await trx
                .select('MANY_PERMISSIONS.permission_id')
                .where({ 'MANY_PERMISSIONS.user_id': req.user.id })
                .from('MANY_PERMISSIONS');

            const permissions = permissionsArray.map(
                (permission: { permission_id: number }) =>
                    permission.permission_id
            );

            const dbUser = await trx
                .select('USERS')
                .where({ 'USERS.id': req.user.id });

            const user = {
                id: dbUser[0].id,
                name: dbUser[0].name,
                email: dbUser[0].email,
                permissions: permissions
            };

            return user;
        });
    }
});

export default router;
