import Knex from 'knex';

const tableName = 'tabelaUsuario';

let up = async (knex: Knex): Promise<void> => {
  return (knex.schema.createTableIfNotExists(tableName, table => {
    table.increments('codigo').primary();
    table.integer('tabelaCodigo').notNullable().unsigned().references('codigo').inTable('tabela');
    table.integer('usuarioAcessoCodigo').notNullable().unsigned().references('codigo').inTable('usuario');
    table.integer('tela').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('inserir').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('alterar').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('deletar').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('visualizar').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('acessar').notNullable().defaultTo(1).comment('0=SEM OPÇÃO;1=NÃO AUTORIZADO;2=AUTORIZADO');
    table.integer('situacao').notNullable().defaultTo(1).comment('1=ATIVO;2=INATIVO');
    table.dateTime('dataCriacao').defaultTo(knex.fn.now(0)).notNullable();
    table.integer('usuarioCodigo').notNullable().unsigned().references('codigo').inTable('usuario');
  }));
};

let down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists(tableName);
}

export { up, down, };