const assert = require('assert');
const PasswordHelper = require('../utils/passwordHelper');

const PASSWORD = 'MYPASSWORD123';
const PASSWORD_HASH = '$2b$10$nQ.BS3LK53fum75vLDiviuIer4GDxLdGNPA8fimE21nxaBxLzkssa';

describe('UserHelper test suite', () => {
  it('should generate a hash password', async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD);
    assert.ok(result.length > 10);
  });

  it('should compare password and password hash', async () => {
    const result = await PasswordHelper.comparePassword(PASSWORD, PASSWORD_HASH);
    assert.ok(result);
  });
});
