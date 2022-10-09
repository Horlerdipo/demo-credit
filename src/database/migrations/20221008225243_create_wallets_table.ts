import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', function (tableBuilder) {
        tableBuilder.increments('id').primary();
        tableBuilder.integer('user_id')
            .unsigned().notNullable();
        tableBuilder.string("account_number").notNullable();
        tableBuilder.float('balance').notNullable().defaultTo(0);
        tableBuilder.timestamps(true, true);

        tableBuilder.foreign('user_id',).references('id').inTable('users').onDelete('cascade');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}

