exports.seed = (knex) => {
  return knex('companies').del()
    .then(() => knex('roles').del())
    .then(() => knex('categories').del())
    .then(() => knex('companies').insert([
      { id: 1, companyName: 'onBoard' },
      { id: 2, companyName: 'xpto' },
      { id: 3, companyName: 'r2022' },
      { id: 4, companyName: 'IPCA' },
    ]))
    .then(() => knex('roles').del().insert([
      { id: 1, roleName: 'Admin' },
      { id: 2, roleName: 'User' },
    ]))
    .then(() => knex('categories').del().insert([
      { id: 1, categoryName: 'Accommodation' },
      { id: 2, categoryName: 'Travel' },
      { id: 3, categoryName: 'Food' },
    ]));
};
