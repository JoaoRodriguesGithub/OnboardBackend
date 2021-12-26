module.exports = (app) => {
  const findAll = () => {
    return app.db('companies')
      .select(['companyName']);
  };
  return { findAll };
};
