module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('transactions').where(filter).select();
  };

  return { find };
};
