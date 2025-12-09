const bcrypt = require('bcrypt');

const plain = process.argv[2];

if (!plain) {
  console.log('Usage: node hash_password.js <password>');
  process.exit(1);
}

bcrypt
  .hash(plain, 10)
  .then(hash => {
    console.log('Plain:', plain);
    console.log('Hash:', hash);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
