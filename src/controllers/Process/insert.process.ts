import knex from '../../database/connection';

const InsertProcess = async (tableName: String, tableData: any) => {

  let trx = await knex.transaction();

  try {
    const codigos = await trx(String(tableName)).insert(tableData);

    await trx.commit();

    return {
      codigo: codigos[0],
      validation: {
        message: 'Registro gravado com sucesso!',
        validate: true,
        pathway: 'insert.process',
      }
    };

  } catch (erroServer) {
    trx.rollback();
    return {
      validation: {
        message: `Falha ao gravar o registro. (${erroServer})`,
        validate: false,
        pathway: 'insert.process',
      }
    }
  }
}

export default InsertProcess;