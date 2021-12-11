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

  const validate = (user) => {
    if (!user.company_id) throw new ValidationError('Company is a mandatory attribute');
    if (!user.name) throw new ValidationError('Name is a mandatory attribute');
    if (!user.email) throw new ValidationError('Email is a mandatory attribute');
    if (!user.password) throw new ValidationError('Password is a mandatory attribute');
    if (!user.role_id) throw new ValidationError('Role is a mandatory attribute');
  };

  const save = async (user) => {
    validate(user);

    const userDb = await findOne({ email: user.email });
    if (userDb) throw new ValidationError('Email duplicated on BD');

    const newUser = { ...user };
    newUser.password = getPasswdHash(user.password);
    return app.db('users').insert(newUser, ['id', 'company_id', 'name', 'email', 'role_id']);
  };

  const update = (id, user) => {
    return app.db('users')
      .where({ id })
      .update(user, '*');
  };

  const remove = async (id) => {
    return app.db('users')
      .where({ id })
      .del();
  };

  return {
    findAll, save, findOne, update, remove,
  };
};
