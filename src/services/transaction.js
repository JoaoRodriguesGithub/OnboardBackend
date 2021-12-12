module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('transactions').where(filter).select();
  };

  const save = (transaction) => {
    return app.db('transactions')
      .insert(transaction, '*');
  };

  return { find, save };
};
