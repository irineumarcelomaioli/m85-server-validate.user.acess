import knex from '../../database/connection';

const ShowProcess = async (tableName: String, codigo: Number) => {

  if (!codigo) {
    return {
      validation: {
        message: 'Código do registro é obrigatório!',
        validate: false,
        pathway: 'show.process',
      }
    }
  }

  let register;
  try {
    register = await knex(String(tableName)).where('codigo', codigo).first();

    if (!register) {
      return {
        validation: {
          message: 'Registro não encontrado!',
          validate: false,
          pathway: 'show.process',
        }
      }
    }

    return {
      ...register,
      validation: {
        message: 'Ok',
        validate: true,
        pathway: 'show.process',
      }
    }

  } catch (erroServer) {
    return {
      validation: {
        message: `Falha ao consultar o registro. (${erroServer})`,
        validate: false,
        pathway: 'show.process',
      }
    }
  }
}

export default ShowProcess;