const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'company_id', 'name', 'email', 'role_id']);
  };
  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswdHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    const userDb = await findOne({ email: user.email });
    if (userDb) throw new ValidationError('There is an user with that email');

    const newUser = { ...user };
    newUser.password = getPasswdHash(user.password);
    return app.db('users').insert(newUser, ['id', 'company_id', 'name', 'email', 'role_id']);
  };

  return { findAll, save, findOne };
};
