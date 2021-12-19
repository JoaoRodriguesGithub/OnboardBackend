const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('transactions').where(filter).select();
  };

  const findOne = (filter = {}) => {
    return app.db('transactions').where(filter).first();
  };

  const save = (transaction) => {
    if (!transaction.date) throw new ValidationError('DATE is a mandatory attribute');
    if (!transaction.category_id) throw new ValidationError('CATEGORY is a mandatory attribute');
    if (!transaction.amount) throw new ValidationError('AMOUNT is a mandatory attribute');

    return app.db('transactions')
      .insert(transaction, '*');
  };

  const update = (id, transaction) => {
    return app.db('transactions')
      .where({ id })
      .update(transaction, '*');
  };

  return {
    find, findOne, save, update,
  };
};
