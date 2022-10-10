import knex, {Knex} from "knex";


class KnexModule {

    //INITIALIZE NEW KNEX FUNCTION AND RETURN IT
    connect(): Knex {
        const config = require("./knexfile");
        return knex(config.development);
    }
}

export default new KnexModule().connect();

