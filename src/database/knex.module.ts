import knex, {Knex} from "knex";


class KnexModule {

    connect(): Knex {
        const config = require("./knexfile")
        return knex(config.development);
    }
}

export default new KnexModule().connect();

