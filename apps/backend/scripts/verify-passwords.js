const { users } = require('../src/data/fixtures/users');
const bcrypt = require('bcryptjs');

const expectedPasswords = {
  admin: 'admin123',
  compras: 'compras123',
  bodega: 'bodega123',
  gerencia: 'gerencia123',
};

(async () => {
  console.log('Password hash verification\n');

  for (const user of users) {
    const expected = expectedPasswords[user.role];
    const match = await bcrypt.compare(expected, user.passwordHash);
    console.log(`Username:       ${user.username}`);
    console.log(`Role:           ${user.role}`);
    console.log(`Expected pass:  ${expected}`);
    console.log(`Hash matches:   ${match}`);
    console.log(`Hash:           ${user.passwordHash}`);
    console.log('');
  }
})();
