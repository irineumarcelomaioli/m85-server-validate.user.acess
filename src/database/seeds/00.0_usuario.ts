import Knex from 'knex';
import Crypto from 'bcrypt';

let seed = async (knex: Knex) => {
  // return;
  await knex('usuario').insert([
    {
      nome: 'USUARIO 01',
      email: 'usuario01@xxx.com',
      senha: String(Crypto.hashSync('123456', 8)),
      programador: true,
    },
  ]);
}

export { seed };