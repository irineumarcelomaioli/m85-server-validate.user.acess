import { Request, Response } from 'express';

import IndexProcess from './Process/index.process';
import InsertProcess from './Process/insert.process';
import ShowProcess from './Process/show.process';
import DeleteProcess from './Process/delete.process';
import UpdateProcess from './Process/update.process';

import ValidateGeneric from './validate/generic.validate';

let pathway = 'generic.controller';

class Controllers {

  async index(request: Request, response: Response) {

    let tableName = request.params.tableName;
    let tableData = request.body;

    let dataInfo = await IndexProcess(String(tableName), tableData, '');

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.status(200).json({ ...dataInfo });

  }

  async insert(request: Request, response: Response) {

    let tableData = request.body;
    let tableName = request.body.tableName;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await InsertProcess(tableName, tableData);

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.status(201).json({ ...dataInfo })
  }

  async show(request: Request, response: Response) {
    let tableName = request.params.tableName;
    let codigo = request.query.codigo;

    let dataInfo = await ShowProcess(String(tableName), Number(codigo));

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.json({ ...dataInfo })
  }

  async delete(request: Request, response: Response) {
    let tableName = request.params.tableName;
    let codigo = request.query.codigo;

    if (!codigo) {
      return response.status(203).json({
        validation: {
          message: 'informe o código do registro',
          validate: false,
          pathway,
        }
      })
    }

    let dataInfo = await DeleteProcess(String(tableName), Number(codigo));

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.status(201).json({ ...dataInfo })
  }

  async update(request: Request, response: Response) {
    let tableName = request.params.tableName;
    let tableData: any = request.body;

    let tableValidate = await ValidateGeneric(tableName, tableData);

    if (!tableValidate.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`
      return response.status(203).json({ ...tableValidate });
    }

    let dataInfo = await UpdateProcess(tableName, tableData);

    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;

    return response.status(201).json({ ...dataInfo });
  }
}

export default Controllers;