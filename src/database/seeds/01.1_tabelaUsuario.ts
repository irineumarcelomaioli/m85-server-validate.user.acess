import Knex from 'knex';

let seed = async (knex: Knex) => {
  // return;
  await knex('tabelaUsuario').insert([
    {
      tabelaCodigo: 1,
      usuarioAcessoCodigo: 1,
      usuarioCodigo: 1,
      tela: 2,
      inserir: 2,
      alterar: 2,
      deletar: 2,
      visualizar: 2,
      acessar: 2
    },
    {
      tabelaCodigo: 2,
      usuarioAcessoCodigo: 1,
      usuarioCodigo: 1,
    },
    {
      tabelaCodigo: 3,
      usuarioAcessoCodigo: 1,
      usuarioCodigo: 1,
    },
  ]);
};

export { seed };