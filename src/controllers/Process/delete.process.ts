import knex from '../../database/connection';

const DeleteProcess = async (tableName: String, codigo: Number) => {

  if (!codigo) {
    return {
      validation: {
        message: 'Código do registro é obrigatório!',
        validate: false,
        pathway: 'delete.process',
      }
    };
  }

  let register;
  try {
    register = await knex(String(tableName)).where('codigo', codigo).first();

    if (!register) {
      return {
        validation: {
          message: 'Registro não encontrado!',
          validate: false,
          pathway: 'delete.process',
        }
      }
    }

    register = await knex(String(tableName))
      .delete()
      .where('codigo', codigo);

    return {
      codigo: register,
      validation: {
        message: 'Registro deletado com sucesso!',
        validate: true,
        pathway: 'delete.process',
      }
    };

  } catch (erroServer) {
    let message;
    if (Object(erroServer).errno === 1451) { // constraint violation
      message = 'O registro não pode ser deletado por conter histórico, altere a situação para inativo!'
    }
    return {
      validation: {
        message: `${message ? message : 'Falha ao deletar o registro.'}`,
        erro: `${Object(erroServer).sqlMessage}`,
        validate: false,
        pathway: 'delete.process',
      }
    };
  }
}

export default DeleteProcess;