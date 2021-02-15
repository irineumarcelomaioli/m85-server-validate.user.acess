const NomeValidate = (nome: String) => {

  let message = 'Ok';
  let validate = true;

  if (nome === '' || !nome) {
    message = 'Informe o campo nome';
    validate = false;
  }

  return {
    validation: {
      message,
      validate,
      pathway: 'nome.validate',
    }
  }
}

export default NomeValidate;