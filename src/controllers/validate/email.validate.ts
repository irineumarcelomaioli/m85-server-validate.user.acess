import IndexProcess from "../Process/index.process";

const EmailValidate = async (tableName: any, email: String) => {

  let mailFormat = /^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  let message = 'Ok';
  let validate = true;

  if (email === '' || !email) {
    message = 'Informe o campo e-mail';
    validate = false;
  } else if (!email.match(mailFormat)) {
    message = 'Informe um e-mail valido!';
    validate = false;
  }

  let exist = false;
  let dataInfo: any;
  if (validate) {
    dataInfo = await IndexProcess(tableName, { data: { email } }, '');
    if (dataInfo[0]) {
      exist = true;
    }
  }

  return {
    validation: {
      message,
      validate,
      exist,
      pathway: 'email.validate',
    }
  }
}

export default EmailValidate;