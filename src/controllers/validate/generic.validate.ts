import knex from '../../database/connection';

interface InfoTable {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string;
  Extra: string;
}

let pathway: 'generic.validate';

const ValidateGeneric = async (tableName: String, tableData: any) => {

  let tableInfo: InfoTable[];

  let showTable = await knex.raw(`SHOW COLUMNS FROM ${tableName}`);

  tableInfo = Object.values(showTable[0]);

  let validate = true;
  let validateField: any;

  tableInfo.map(table => {
    if (table.Null === 'NO' && table.Default === null && table.Extra === "") {
      let findField = false;
      Object.keys(tableData).map((fieldName, index) => {
        if (table.Field === fieldName && !Object.values(tableData)[index]) {
          validateField = {
            ...validateField,
            [table.Field]: {
              validation: {
                message: `Informe o campo ${table.Field}`,
                validate: false,
                pathway,
              }
            },
          }
          validate = false;
          findField = true;
        } else if (table.Field === fieldName && Object.values(tableData)[index]) {
          validateField = {
            ...validateField,
            [table.Field]: {
              validation: {
                message: `Ok`,
                validate: true,
                pathway,
              }
            },
          }
          findField = true;
        };
      });
      if (!findField) {
        validateField = {
          ...validateField,
          [table.Field]: {
            validation: {
              message: `Informe o campo ${table.Field}`,
              validate: false,
              pathway,
            }
          },
        }
        validate = false;
      }
    }
  });

  validateField = {
    ...validateField,
    validation: {
      message: validate ? 'Ok' : 'Preencha os campos obrigatótios',
      validate,
      pathway,
    }
  }

  return ({ ...validateField });
}

export default ValidateGeneric;