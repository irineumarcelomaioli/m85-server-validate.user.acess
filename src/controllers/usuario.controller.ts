import knex from '../database/connection';
import { Request, Response } from 'express';

import Crypto from 'bcrypt';
import Jwt from 'jsonwebtoken';

import NomeValidate from './validate/nome.validate';
import EmailValidate from './validate/email.validate';
import SenhaValidate from './validate/senha.validate';
import ValidateGeneric from './validate/generic.validate';

import IndexProcess from './Process/index.process';
import InsertProcess from './Process/insert.process';
import UpdateProcess from './Process/update.process';

let tableName = 'usuario';
let pathway = 'usuario.controller';

interface PropsToken {
  auth: boolean;
  message: String;
  code: number;
  name: String;
  programmer: boolean;
  pathway: string;
}

interface PropsTable {
  codigo: number,
  nome: String,
  email: String,
  senha: String,
  programador: boolean,
  situacao: number,
  dataCriacao: Date,
  usuarioCodigo: number,
}

class controllers {
  async authenticate(request: Request, response: Response) {

    let { email, senha } = request.body;

    let validateField = {
      email: await EmailValidate(tableName, email),
      senha: SenhaValidate(senha),
      auth: email.validate && senha.validate ? true : false,
    };

    if (!validateField.email.validation.validate || !validateField.senha.validation.validate) {
      validateField.email.validation.pathway = `${pathway}//${validateField.email.validation.pathway}`;
      validateField.senha.validation.pathway = `${pathway}//${validateField.senha.validation.pathway}`;
      return response.status(200).json({ ...validateField });
    }

    let register;
    try {
      register = await knex(tableName)
        .select('*')
        .where('email', String(email))
        .first();
    } catch (err) {
      return response.status(500).json({
        validation: {
          message: 'Falha ao autenticar o registro.',
          validate: false,
          pathway,
        }
      })
    }


    if (!register) {
      return response.status(200).json({
        email: {
          validation: {
            message: 'E-mail não cadastrado.',
            validate: false,
            pathway,
          }
        },
        auth: false,
      });
    }

    var passwordIsValid = Crypto.compareSync(
      senha,
      register.senha
    );

    if (!passwordIsValid) {
      return response.status(200).json({
        senha: {
          validation: {
            message: 'Senha inválida.',
            validate: false,
            pathway,
          }
        },
        auth: false,
      });
    }

    var token = Jwt.sign(
      {
        code: register.codigo,
        name: register.nome,
        programmer: Boolean(register.programador),
      },
      'm85.tech-token-user-system',
      { expiresIn: 16200 }, // 16200 segundo = 4 horas e 30 minutos
    )

    return response.status(200).json({
      token,
      auth: true,
      email: {
        ...validateField.email,
      },
      senha: {
        ...validateField.senha,
      },
    });

  }

  async verifyToken(request: Request, response: Response) {
    let { token } = request.body;
    let tokenData: PropsToken;

    let tokenIsValid;
    try {
      tokenIsValid = Jwt.verify(token, 'm85.tech-token-user-system',);
    } catch (err) {
      tokenData = {
        auth: false,
        message: 'Token inválido',
        code: 0,
        name: '',
        programmer: false,
        pathway,
      }
      return response.status(200).json(tokenData);
    }

    if (!tokenIsValid) {
      tokenData = {
        auth: false,
        message: 'Token inválido',
        code: 0,
        name: '',
        programmer: false,
        pathway,
      }
      return response.status(200).json(tokenData);
    }

    token = Jwt.decode(token);

    let dateNow = Number(new Date().getTime() / 1000);
    let dateExpire = Number(token.exp);

    if (dateExpire < dateNow) {
      tokenData = {
        auth: false,
        message: 'Token expirou',
        code: 0,
        name: '',
        programmer: false,
        pathway,
      }
      return response.status(200).json(tokenData);
    }

    tokenData = {
      auth: true,
      message: 'Ok',
      code: Number(token.code),
      name: token.name,
      programmer: Boolean(token.programmer),
      pathway,
    }

    return response.status(200).json(tokenData);
  }

  async userAcessTable(request: Request, response: Response) {

    let tableForeign = [
      {
        foreignKey: 'tabelaCodigo',
        table: 'tabela',
        key: 'codigo',
        fieldName: { 'nome': 'tabelaNome', 'direcionamento': 'tabelaDirecionamento', 'show': 'tabelaShow' }
      },
      {
        foreignKey: 'usuarioCodigo',
        table: 'usuario',
        key: 'codigo',
        fieldName: { 'nome': 'usuarioNome' }
      },
      {
        foreignKey: 'usuarioAcessoCodigo',
        table: 'usuario',
        key: 'codigo',
        fieldName: { 'nome': 'usuarioAcessoNome' }
      },
    ]

    let tableData = {
      data: { ...request.body }
    }

    let dataInfo = await IndexProcess('tabelausuario', tableData, tableForeign);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.json({ ...dataInfo });

  }

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

    if (!tableValidate.validation.validate) {
      tableValidate.validation.pathway = `${pathway}//${tableValidate.validation.pathway}`
      return response.status(203).json({ ...tableValidate });
    }

    let tableValidateEmail = await EmailValidate(tableName, tableData.email);
    let tableValidateSenha = SenhaValidate(tableData.senha);

    tableValidate = {
      email: { ...tableValidateEmail },
      senha: { ...tableValidateSenha },
    };

    if (!tableValidate.email.validation.validate || !tableValidate.senha.validation.validate) {
      tableValidate.email.validation.pathway = `${pathway}//${tableValidate.email.validation.pathway}`;
      tableValidate.senha.validation.pathway = `${pathway}//${tableValidate.senha.validation.pathway}`;
      return response.status(203).json({ ...tableValidate });
    }

    if (tableValidate.email.validation.exist) {
      tableValidate.email.validation.message = 'E-mail já cadastrado.'
      tableValidate.email.validation.validate = false;
      tableValidate.email.validation.pathway = `${pathway}//${tableValidate.email.validation.pathway}`;
      return response.status(203).json({ ...tableValidate, });
    }

    let senhaCrypto = Crypto.hashSync(request.body.senha, 8);

    tableData.senha = senhaCrypto;

    let dataInfo = await InsertProcess(tableName, tableData);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`;
    return response.status(201).json({ ...dataInfo })
  }

  async update(request: Request, response: Response) {
    let tableData: PropsTable = request.body;

    let tableValidate: any;
    let tableValidateNome: any;
    let tableValidateEmail: any;
    let tableValidateSenha: any;

    let nome = false;
    let email = false;
    let senha = false;
    let validate = true;

    Object.keys(tableData).map(async (dataKey) => {
      if (dataKey === 'nome') {
        nome = true;
      }
      if (dataKey === 'email') {
        email = true;
      }
      if (dataKey === 'senha') {
        senha = true;
        tableData.senha = Crypto.hashSync(tableData.senha, 8)
      }
    });

    if (nome) {
      tableValidateNome = NomeValidate(tableData.nome);
      tableValidateNome.validation.pathway = `${pathway}//${tableValidateNome.validation.pathway}`;
      validate = !tableValidateNome.validation.validate ? false : true;
    }
    if (email) {
      tableValidateEmail = await EmailValidate(tableName, tableData.email);
      tableValidateEmail.validation.pathway = `${pathway}//${tableValidateEmail.validation.pathway}`;
      validate = !tableValidateEmail.validation.validate ? false : true;
    }
    if (senha) {
      tableValidateSenha = SenhaValidate(tableData.senha);
      tableValidateSenha.validation.pathway = `${pathway}//${tableValidateSenha.validation.pathway}`;
      validate = !tableValidateSenha.validation.validate ? false : true;
    }

    tableValidate = {
      ...tableValidate,
      nome: { ...tableValidateNome },
      email: { ...tableValidateEmail },
      senha: { ...tableValidateSenha },
      validation: {
        validate,
      }
    }

    if (!tableValidate.validation.validate) {
      tableValidate.validation.pathway = pathway;
      return response.status(200).json({ ...tableValidate });
    }

    let dataInfo = await UpdateProcess(tableName, tableData);
    dataInfo.validation.pathway = `${pathway}//${dataInfo.validation.pathway}`
    if (!dataInfo.validation.validate) {
      return response.status(200).json({ ...dataInfo });
    }

    return response.status(200).json({ ...dataInfo });
  }

}

export default controllers;