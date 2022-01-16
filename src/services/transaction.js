const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('categories')
      .select('id', 'categoryName');
  };

  const find = (filter = {}) => {
    return app.db('transactions')
      .join('categories', 'transactions.category_id', 'categories.id')
      .where(filter)
      .select('transactions.id', 'transactions.user_id', 'transactions.date', 'transactions.amount', 'transactions.category_id', 'categories.categoryName');
  };

  const findOne = (filter = {}) => {
    return app.db('transactions').where(filter).first();
  };

  const save = (transaction) => {
    if (!transaction.date) throw new ValidationError('DATE is a mandatory attribute');
    if (Date.parse(transaction.date) > Date.now()) {
      throw new ValidationError('DATE future not authorized');
    }
    if (!transaction.category_id) throw new ValidationError('CATEGORY is a mandatory attribute');
    if (!transaction.amount) throw new ValidationError('AMOUNT is a mandatory attribute');

    const newTransaction = { ...transaction };
    if (transaction.amount < 0) {
      newTransaction.amount *= -1;
    }

    return app.db('transactions')
      .insert(newTransaction, '*');
  };

  const update = (id, transaction) => {
    return app.db('transactions')
      .where({ id })
      .update(transaction, '*');
  };
  const remove = (id) => {
    return app.db('transactions')
      .where({ id })
      .del();
  };

  return {
    find, findOne, save, update, remove, findAll,
  };
};
