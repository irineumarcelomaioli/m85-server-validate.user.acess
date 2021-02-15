import Knex from 'knex';

let tableName = 'tabela';

let up = async (knex: Knex): Promise<void> => {
  return (knex.schema.createTableIfNotExists(tableName, table => {
    table.increments('codigo').primary();
    table.string('nome').notNullable();
    table.string('direcionamento').notNullable().comment('Para onde direcionar a opção.');
    table.boolean('tela').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('inserir').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('alterar').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('deletar').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('visualizar').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('acessar').notNullable().defaultTo(0).comment('0=SEM ESSA OPÇÃO;1=POSSUI');
    table.boolean('show').notNullable().defaultTo(0).comment('0=NÃO MOSTRAR;1=MOSTRAR')
    table.integer('situacao').notNullable().defaultTo(1).comment('1=ATIVO;2=INATIVO');
    table.dateTime('dataCriacao').notNullable().defaultTo(knex.fn.now(0));
    table.integer('usuarioCodigo').notNullable().unsigned().references('codigo').inTable('usuario');
  }))
}

let down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists(tableName);
}

export { up, down, };