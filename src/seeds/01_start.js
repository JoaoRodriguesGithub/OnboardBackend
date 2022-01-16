exports.seed = (knex) => {
  return knex('transactions').del()
    .then(() => knex('users').del())
    .then(() => knex('roles').del())
    .then(() => knex('categories').del())
    .then(() => knex('companies').del())
    .then(() => knex('companies').insert([
      { id: 1, companyName: 'onBoard' },
      { id: 2, companyName: 'xpto' },
      { id: 3, companyName: 'r2022' },
      { id: 4, companyName: 'IPCA' },
    ]))
    .then(() => knex('categories').insert([
      { id: 1, categoryName: 'Accommodation' },
      { id: 2, categoryName: 'Travel' },
      { id: 3, categoryName: 'Food' },
    ]))
    .then(() => knex('roles').insert([
      { id: 1, roleName: 'Admin' },
      { id: 2, roleName: 'User' },
    ]))
    .then(() => knex('users').insert([
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
      {
        id: 10004, company_id: 2, name: 'comerial2', email: 'cxpto2@xpto.com', password: '$2a$10$yxwimTfwl.yRJpGNgsaWP.5q0kYGMG9Id9v/FgkcQ4tAXheuNOLvW', role_id: 2,
      },
    ]))
    .then(() => knex('transactions').del().insert([
      {
        id: 10100, user_id: 10000, date: new Date(), category_id: 3, amount: 6,
      },
      {
        id: 10101, user_id: 10000, date: new Date(), category_id: 2, amount: 100,
      },
      {
        id: 10102, user_id: 10001, date: new Date(), category_id: 1, amount: 200,
      },
      {
        id: 10103, user_id: 10001, date: new Date(), category_id: 3, amount: 10,
      },

    ]));
};
