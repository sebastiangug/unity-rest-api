import { Request, Response, NextFunction } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';
import { knex } from '../util/database';

const router = express();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUser();
        const token = jwt.sign(user, process.env.jwtKey, {
          expiresIn: '900s',
          algorithm: 'HS256'
        });
        res.send(token);
      } catch (err) {
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
            (permission: {permission_id: number}) => permission.permission_id
          );
  
          const dbUser = await trx
            .select(
              'USERS.*',
              'CLIENTS.org_name as client_name',
              'CLIENTS.id as client_id',
              'CLIENTS.teams_id',
              'CLIENTS.theo_id'
            )
            .from('USERS')
            .where({ 'USERS.id': req.user.id })
            .leftJoin('CLIENTS', 'USERS.client_id', 'CLIENTS.id');
  
          const user = {
            id: dbUser[0].id,
            name: dbUser[0].name,
            email: dbUser[0].email,
            permissions: permissions,
            client: dbUser[0].client_name,
            client_id: dbUser[0].client_id,
            teams_id: dbUser[0].teams_id,
            theo_id: dbUser[0].theo_id
          };
  
          return user;
        });
});

export default router;
