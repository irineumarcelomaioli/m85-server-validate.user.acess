const SenhaValidate = (senha: String) => {

  let message = 'Ok';
  let validate = true;

  if (senha === '' || !senha) {
    message = 'Informe o campo senha';
    validate = false;
  } else if (senha.length < 6) {
    message = 'Informe uma senha com no mínimo 6 digitos';
    validate = false;
  }

  return {
    validation: {
      message,
      validate,
      pathway: 'senha.validate',
    }
  }
}

export default SenhaValidate;