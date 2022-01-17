const request = require('supertest');

const app = require('../src/app');

test('Testing if it is solving the route', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
