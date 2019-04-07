import Knex from 'knex';

export const knex = Knex({
    client: 'mssql',
    connection: {
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        options: {
            encrypt: true
        }
    }
});
