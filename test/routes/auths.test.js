const request = require('supertest');

const app = require('../../src/app');

test('Test #1 - Create user with signup', () => {
  const email = `${Date.now()}@onboard.com`;
  return request(app).post('/auth/signup')
    .send({
      company_id: '1', name: 'Jorge Rodrigues', email, password: '123456', role_id: '1',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Jorge Rodrigues');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Test #2 - Recieve token when authenticating ', () => {
  const email = `${Date.now()}@onboard.com`;
  return app.services.user.save(
    {
      company_id: '1', name: 'Jorge Rodrigues', email, password: '123456', role_id: '1',
    },
  ).then(() => request(app).post('/auth/signin')
    .send({ email, password: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Test #3 - Wrong authentication attempt with wrong password', () => {
  const email = `${Date.now()}@onboard.com`;
  return app.services.user.save(
    {
      company_id: '1', name: 'Jorge Rodrigues', email, password: '123456', role_id: '1',
    },
  ).then(() => request(app).post('/auth/signin')
    .send({ email, password: '654321' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user or password');
    });
});

test('Test #4 - Wrong authentication attempt with wrong user', () => {
  return request(app).post('/auth/signin')
    .send({ email: 'doesnotexist@mail.com', password: '654321' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user or password');
    });
});

test('Test #5 - Access to protected routes', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
// TODO service.user.save falta a condição de verificao na tabela para a role
test.skip('Test #6 - Only have one admin per company', () => {
  const email = `${Date.now()}@onboard.com`;
  return request(app).post('/auth/signup')
    .send(
      {
        company_id: '1', name: 'Jorge Rodrigues', email, password: '123456', role_id: '1',
      },
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Already exists an admin for this company');
    });
});
