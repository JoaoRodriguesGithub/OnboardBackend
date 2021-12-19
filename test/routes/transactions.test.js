const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
const secret = 'onBoardIsCool!';
const user = { id: 10000, name: 'admin1', email: 'abc@onboard.com' };
const user2 = { id: 10002, name: 'admin1', email: 'axpto@xpto.com' };
const TOKEN = jwt.encode(user, secret);
const TOKEN2 = jwt.encode(user2, secret);

beforeAll(async () => {
  await app.db.seed.run();
});

test('Test #1 - List only user transactions', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].amount).toBe('6.00');
    });
});

test('Test #2 - Insert user transactions', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
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
      .set('authorization', `bearer ${TOKEN2}`)
      .send({
        user_id: 10002, date: new Date(), category_id: '1', amount: 60, ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Test #3.1 - Insert transaction without Date', () => testTemplate({ date: null }, 'DATE is a mandatory attribute'));

  test('Test #3.2 - Insert transaction without Category', () => testTemplate({ category_id: null }, 'CATEGORY is a mandatory attribute'));

  test('Test #3.3 - Insert transaction without Amount', () => testTemplate({ amount: null }, 'AMOUNT is a mandatory attribute'));
});

test('Test #4 - List user transactions by transaction id', () => {
  return app.db('transactions').insert({
    user_id: 10000, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).get(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(result[0].id);
        expect(res.body.amount).toBe('60.00');
      }));
});

test('Test #5 - Update transaction', () => {
  return app.db('transactions').insert({
    user_id: user.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).put(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ amount: '100.00' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(result[0].id);
        expect(res.body.amount).toBe('100.00');
      }));
});

test('Test #6 - Remove transaction ', () => {
  return app.db('transactions').insert({
    user_id: user.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).delete(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(204);
      }));
});

test('Test #7 - Delete transaction from another user', () => {
  return app.db('transactions').insert({
    user_id: user2.id, date: new Date(), category_id: '1', amount: 60,
  }, ['id'])
    .then((result) => request(app).delete(`${MAIN_ROUTE}/${result[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Access denied');
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
