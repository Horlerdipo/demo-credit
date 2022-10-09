import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('users', function (tableBuilder) {
            tableBuilder.increments('id').primary();
            tableBuilder.string('email', 255).notNullable().unique();
            tableBuilder.string('name', 255).notNullable();
            tableBuilder.string('pin', 255).notNullable();
            tableBuilder.string('token', 255).notNullable();
            tableBuilder.timestamps(true, true)
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

