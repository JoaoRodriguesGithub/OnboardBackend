exports.seed = (knex) => {
  return knex('users').del()
    .then(() => knex('roles').del())
    .then(() => knex('categories').del())
    .then(() => knex('companies').del())
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
    ]))
    .then(() => knex('users').del().insert([
      {
        id: 10000, company_id: 1, name: 'admin1', email: 'abc@onboard.com', password: '$2a$10$yxwimTfwl.yRJpGNgsaWP.5q0kYGMG9Id9v/FgkcQ4tAXheuNOLvW', role_id: 1,
      },
      {
        id: 10001, company_id: 1, name: 'comercial1', email: 'comercial1@onboard.com', password: '$2a$10$yxwimTfwl.yRJpGNgsaWP.5q0kYGMG9Id9v/FgkcQ4tAXheuNOLvW', role_id: 2,
      },
      {
        id: 10002, company_id: 2, name: 'admin1', email: 'axpto@xpto.com', password: '$2a$10$yxwimTfwl.yRJpGNgsaWP.5q0kYGMG9Id9v/FgkcQ4tAXheuNOLvW', role_id: 1,
      },
      {
        id: 10003, company_id: 2, name: 'comerial1', email: 'cxpto@xpto.com', password: '$2a$10$yxwimTfwl.yRJpGNgsaWP.5q0kYGMG9Id9v/FgkcQ4tAXheuNOLvW', role_id: 2,
      },
    ]));
};
