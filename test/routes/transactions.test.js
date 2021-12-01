const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;

test.skip('Test #1 - List only user transactions', () => {
  return app.db('transactions').insert([
    {
      user_id: user.id, date: new Date(), category_id: '1', amount: 60,
    },
    {
      user_id: user2.id, date: new Date(), category_id: '3', amount: 200,
    },
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].amount).toBe('60.00');
    }));
});

test.skip('Test #2 - Insert user transactions', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      user_id: user.id, date: new Date(), category_id: '1', amount: 60,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.user_id).toBe(user.id);
      expect(res.body.amount).toBe('60.00');
    });
});

describe('Test #3 - Validation of transaction creation', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        user_id: user.id, date: new Date(), category_id: '1', amount: 60, ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test.skip('Test #3.1 - Insert transaction without Date', () => testTemplate({ date: null }, 'DATE is a mandatory attribute'));

  test.skip('Test #3.2 - Insert transaction without Category', () => testTemplate({ category_id: null }, 'CATEGORY is a mandatory attribute'));

  test.skip('Test #3.3 - Insert transaction without Amount', () => testTemplate({ amount: null }, 'AMOUNT is a mandatory attribute'));
});

test.skip('Test #4 - List user transactions by transaction id', () => {
  return app.db('transactions').insert({
    user_id: user.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).get(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(result[0].id);
        expect(res.body.amount).toBe('60.00');
      }));
});

test.skip('Test #5 - Update transaction', () => {
  return app.db('transactions').insert({
    user_id: user.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).put(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ amount: '100.00' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(result[0].id);
        expect(res.body.amount).toBe('100.00');
      }));
});

test.skip('Test #6 - Remove transaction ', () => {
  return app.db('transactions').insert({
    user_id: user.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).delete(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(204);
      }));
});

test.skip('Test #7 - Access transaction from another user', () => {
  return app.db('transactions').insert({
    user_id: user2.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).delete(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('This resource does not belong to this user');
      }));
});

test.skip('Test #8 - Transaction ammount must be positive', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      user_id: user.id, date: new Date(), category_id: '1', amount: -60,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.user_id).toBe(user.id);
      expect(res.body.amount).toBe('60.00');
    });
});
