import knex from '../../database/connection';

const IndexProcess = async (tableName: String, tableData: any, tableForeign: any) => {

  let dataSearch = tableData.data;
  let anywhere = tableData.anywhere;
  let fieldOrderBy = tableData.OrderBy;
  let OrderByDirection = tableData.OrderByDirection;

  if (!anywhere) {
    anywhere = false;
  }

  try {
    let sql;
    let sqlSelect = `select a.*`;
    let sqlFrom = `from ${tableName} a`;
    let sqlJoin = '';
    let sqlWhere: any;
    let sqlOrderBy = fieldOrderBy ? `order by ${fieldOrderBy} ${OrderByDirection}` : '';

    // START => WHERE
    if (dataSearch) {
      Object.keys(dataSearch).map((dataKey, index) => {
        let dataValue = Object.values(dataSearch)[index];

        if (index === 0 || !sqlWhere) {
          if (Number(dataValue)) {
            sqlWhere = `where a.${dataKey} = '${dataValue}'`
          } else {
            if (!anywhere) {
              sqlWhere = `where a.${dataKey} like '${dataValue}%'`
            } else {
              sqlWhere = `where a.${dataKey} like '%${dataValue}%'`
            }
          }
        } else {
          if (Number(dataValue)) {
            sqlWhere = `${sqlWhere} and a.${dataKey} = '${dataValue}'`
          } else {
            if (!anywhere) {
              sqlWhere = `${sqlWhere} and a.${dataKey} like '${dataValue}%'`
            } else {
              sqlWhere = `${sqlWhere} and a.${dataKey} like '%${dataValue}%'`
            }
          }
        }
      });
    }
    // END => WHERE

    // START => FOREIGN
    if (tableForeign) {
      let joinField: any;
      Object.values(tableForeign).map((table, index) => {
        let foreignIndex = index;
        joinField = tableForeign[foreignIndex].fieldName;
        Object.keys(joinField).map((fieldTable, index) => {
          let fieldReturn = Object.values(joinField)[index]
          sqlSelect = `${sqlSelect}, b${foreignIndex}.${fieldTable} as ${fieldReturn} `
        })

        sqlJoin = `${sqlJoin} left join ${tableForeign[foreignIndex].table} b${foreignIndex} on a.${tableForeign[foreignIndex].foreignKey} = b${foreignIndex}.${tableForeign[index].key} `;
      })
    }
    // END => FOREIGN

    sql = sqlSelect + ' ' + sqlFrom;
    sql = sql + (sqlJoin ? ' ' + sqlJoin : '');
    sql = sql + (sqlWhere ? ' ' + sqlWhere : '');
    sql = sql + (sqlOrderBy ? ' ' + sqlOrderBy : '');

    let register;

    // console.log('---------------------------------------------------------------------');
    // console.log(sql);

    register = await knex.raw(sql);

    register = register[0];
    register = Object.values(register);
    register = Object.values(register);

    if (!register[0]) {
      return {
        validation: {
          message: 'Registro não Encontrado',
          validate: false,
          pathway: 'index.process',
        }
      }
    }

    return {
      ...Object.values(register),
      validation: {
        message: 'Ok',
        validate: true,
        pathway: 'index.process',
      }
    }

  } catch (erroServer) {
    return {
      validation: {
        message: `Falha no servidor. (${erroServer})`,
        validate: false,
        pathway: 'index.process',
      }
    }
  }
}

export default IndexProcess;