const bcrypt = require('bcrypt');

const { SALT_PWD } = process.env;
class PasswordHelper {
  static hashPassword(password) {
    return bcrypt.hash(password, parseInt(SALT_PWD));
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = PasswordHelper;
