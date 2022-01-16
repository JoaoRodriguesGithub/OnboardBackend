module.exports = (app) => {
  const findAll = () => {
    return app.db('companies')
      .select(['id', 'companyName']);
  };
  return { findAll };
};
