import { Request, Response } from 'express';

import ValidateGeneric from './validate/generic.validate';

import IndexProcess from './Process/index.process';
import InsertProcess from './Process/insert.process';
import UpdateProcess from './Process/update.process';

let tableName = 'tabela';
let pathway = 'tabela.controller';

interface PropsTable {
  codigo: number,
  nome: String,
  direcionamento: String,
  tela: boolean,
  inserir: boolean,
  alterar: boolean,
  deletar: boolean,
  visualizar: boolean,
  show: boolean,
  situacao: number,
  dataCriacao: Date,
  usuarioCodigo: number,
}

class controllers {

  async index(request: Request, response: Response) {

    let tableData = request.body;

    let tableForeign = [
      {
        foreignKey: 'usuarioCodigo',
        table: 'usuario',
        key: 'codigo',
        fieldName: { 'nome': 'usuarioNome' },
      },
    ]

    let dataInfo = await IndexProcess(tableName, tableData, tableForeign);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.status(200).json({ ...dataInfo });

  }

  async insert(request: Request, response: Response) {

    let tableData: PropsTable = request.body;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await InsertProcess(tableName, tableData);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.status(201).json({ ...dataInfo })
  }

  async update(request: Request, response: Response) {
    let tableData: PropsTable = request.body;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await UpdateProcess(tableName, tableData);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    if (!dataInfo.validation.validate) {
      return response.status(203).json({ ...dataInfo });
    }

    return response.status(201).json({ ...dataInfo });
  }
}

export default controllers;