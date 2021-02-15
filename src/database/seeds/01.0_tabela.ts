import Knex from 'knex';

let seed = async (knex: Knex) => {
  // return;
  await knex('tabela').insert([
    {
      nome: 'USUÁRIO',
      direcionamento: 'usuario',
      usuarioCodigo: 1,
      show: 1,
      tela: 1,
      inserir: 1,
      alterar: 1,
      deletar: 1,
      visualizar: 1,
      acessar: 1,
    },
    {
      nome: 'TABELA',
      direcionamento: 'tabela',
      usuarioCodigo: 1,
      show: 1,
      tela: 1,
      inserir: 1,
      alterar: 1,
      deletar: 1,
      visualizar: 1,
      acessar: 1,
    },
    {
      nome: 'TABELA USUÁRIO',
      direcionamento: 'tabelausuario',
      usuarioCodigo: 1,
    },

  ]);
};

export { seed };