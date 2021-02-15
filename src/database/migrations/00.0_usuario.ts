import Knex from 'knex';

const tableName = 'usuario';

let up = async (knex: Knex): Promise<void> => {
  return (knex.schema.createTableIfNotExists(tableName, table => {
    table.increments('codigo').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable();
    table.string('senha').notNullable();
    table.boolean('programador').notNullable().defaultTo(0).comment('É Programdor do sistema');
    table.integer('situacao').notNullable().defaultTo(1).comment('1=ATIVO;2=INATIVO');
    table.dateTime('dataCriacao').defaultTo(knex.fn.now(0)).notNullable();
    table.integer('usuarioCodigo').nullable().references('codigo').inTable('usuario').unsigned();
  }))
}

let down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable(tableName);
}

export { up, down, };