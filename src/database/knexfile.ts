import type {Knex} from "knex";
import * as dotenv from 'dotenv'

dotenv.config({
    //ENV PATH FOR DATABASE MIGRATION
    // path: '../../.env'
    //ENV PATH FOR PROJECT
    path: '.env'

});
const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    },
};

module.exports = config;


