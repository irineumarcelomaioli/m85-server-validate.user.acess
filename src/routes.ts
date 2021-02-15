import express from 'express';

// IMPORT CONTROLLERS
import GenericController from './controllers/generic.controller';
import UsuarioController from './controllers/usuario.controller';
import TabelaUsuarioController from './controllers/tabelaUsuario.controller';

const routes = express.Router();

// NOVA INSTANCIA PARA O CONTROLLERS
const genericController = new GenericController();
const usuarioController = new UsuarioController();
const tabelaUsuarioController = new TabelaUsuarioController();

//ROUTES - GENERIC
let tableName = 'generic';
routes.get(`/${tableName}/index/:tableName`, genericController.index);
routes.get(`/${tableName}/show/:tableName`, genericController.show);
routes.delete(`/${tableName}/delete/:tableName`, genericController.delete);
routes.post(`/${tableName}/insert/:tableName`, genericController.insert);

//ROUTES - TABLES
tableName = 'usuario';
routes.post(`/${tableName}/authenticate`, usuarioController.authenticate);
routes.post(`/${tableName}/verifyToken`, usuarioController.verifyToken);
routes.post(`/${tableName}/useracesstable`, usuarioController.userAcessTable);
routes.post(`/${tableName}/index`, usuarioController.index); // Metodo post na consulta para receber parâmetro via body.
routes.post(`/${tableName}/insert`, usuarioController.insert);
routes.put(`/${tableName}/update`, usuarioController.update);

tableName = 'tabelausuario';
routes.post(`/${tableName}/index`, tabelaUsuarioController.index); // Metodo post na consulta para receber parâmetro via body.
routes.post(`/${tableName}/insert`, tabelaUsuarioController.insert);
routes.put(`/${tableName}/update`, tabelaUsuarioController.update);

export default routes;