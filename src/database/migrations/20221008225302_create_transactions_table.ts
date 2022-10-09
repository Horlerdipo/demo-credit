import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', function (tableBuilder) {
        tableBuilder.increments('id').primary();
        tableBuilder.string('transaction_id');
        tableBuilder.string('type');
        tableBuilder.integer('sender')
            .unsigned().nullable();
        tableBuilder.integer('receiver')
            .unsigned().nullable();
        tableBuilder.float('amount').notNullable().defaultTo(0);
        tableBuilder.float('prev_balance').notNullable().defaultTo(0);
        tableBuilder.float('next_balance').notNullable().defaultTo(0);
        tableBuilder.timestamps(true, true);

        tableBuilder.foreign('sender').references('id').inTable('users').onDelete('set null');
        tableBuilder.foreign('receiver').references('id').inTable('users').onDelete('set null');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

