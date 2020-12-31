const bcrypt = require('bcrypt');

const SALT = 10;
class PasswordHelper {
  static hashPassword(password) {
    return bcrypt.hash(password, SALT);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = PasswordHelper;
