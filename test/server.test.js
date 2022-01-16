const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test.skip('Validate if the server responds at 3001 port', () => {
  return request.get('/')
    .then((res) => expect(res.status).toBe(200));
});
