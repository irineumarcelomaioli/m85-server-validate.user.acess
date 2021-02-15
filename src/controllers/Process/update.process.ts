import knex from '../../database/connection';

const UpdateProcess = async (tableName: String, tableData: any) => {

  let register;
  if (!tableData.codigo) {
    return {
      validation: {
        message: 'Código do registro é obrigatório!',
        pathway: 'update.process',
        validate: false,
      }
    };
  } else {
    register = await knex(String(tableName)).where('codigo', Number(tableData.codigo)).first();
    if (!register) {
      return {
        validation: {
          message: 'Registro não encontrado!',
          pathway: 'update.process',
          validate: false,
        }
      }
    }
  }

  let fieldUpdate = false;
  Object.keys(tableData).map(dataKey => {
    if (dataKey !== 'codigo') {
      fieldUpdate = true;
    }
  })

  if (!fieldUpdate) {
    return {
      validation: {
        message: 'Nenhuma informação foi altarada no registro',
        pathway: 'update.process',
        validate: false,
      }
    }
  }

  let trx = await knex.transaction();

  try {
    await trx(String(tableName))
      .update(tableData)
      .where('codigo', tableData.codigo);

    await trx.commit();

    register = await knex(String(tableName)).where('codigo', Number(tableData.codigo)).first();

    return {
      ...register,
      validation: {
        message: 'Registro alterado com sucesso!',
        pathway: 'update.process',
        validate: true,
      }
    };

  } catch (erroServer) {
    trx.rollback();
    return {
      validation: {
        message: `Falha ao alterar o registro. (${erroServer})`,
        pathway: 'update.process',
        validate: false,
      }
    }
  }
}

export default UpdateProcess;