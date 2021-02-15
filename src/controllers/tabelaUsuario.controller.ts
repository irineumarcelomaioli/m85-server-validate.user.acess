import { Request, Response } from 'express';

import ValidateGeneric from './validate/generic.validate';

import IndexProcess from './Process/index.process';
import InsertProcess from './Process/insert.process';
import UpdateProcess from './Process/update.process';

let tableName = 'tabelausuario';
let pathway = 'tabelaUsuario.controller';

interface PropsTable {
  codigo: number,
  tabelaCodigo: number,
  usuarioAcessoCodigo: Number,
  tela: boolean,
  inserir: boolean,
  alterar: boolean,
  deletar: boolean,
  visualizar: boolean,
  acessar: boolean,
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
      {
        foreignKey: 'tabelaCodigo',
        table: 'tabela',
        key: 'codigo',
        fieldName: { 'nome': 'tabelaNome', 'show': 'tabelaShow' },
      },
      {
        foreignKey: 'usuarioAcessoCodigo',
        table: 'usuario',
        key: 'codigo',
        fieldName: { 'nome': 'usuarioAcessoNome' },
      },
    ]

    tableData = {
      ...tableData,
      OrderBy: 'tabelaNome',
      OrderByDirection: 'asc',
    }

    let dataInfo = await IndexProcess(tableName, tableData, tableForeign);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.status(200).json({ ...dataInfo });

  }

  async update(request: Request, response: Response) {

    let tableData: PropsTable = request.body;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validation.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await UpdateProcess(tableName, tableData);

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.status(201).json({ ...dataInfo, })
  }

  async insert(request: Request, response: Response) {

    let tableData: PropsTable = request.body;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validation.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await InsertProcess(tableName, tableData);

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.status(201).json({ ...dataInfo })
  }

}

export default controllers;