const { model } = require('../lib/db');
const bcrypt = require('bcryptjs');

const User = model('User');

User.createUser = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  return User.create({ ...data, password: hashedPassword });
};

// Add matchPassword helper
User.prototype = User.prototype || {};
User.matchPassword = async function (hashedPassword, enteredPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = User;
