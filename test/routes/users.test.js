const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';

let user;

test.skip('Test #1 - List all users', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test.skip('Test #2 - Insert users', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('João Rodrigues');
      expect(res.body).not.toHaveProperty('password');
    });
});

test.skip('Test #3 - Insert user without company', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Company is a mandatory attribute');
    });
});

test.skip('Test #4 - Insert user without name', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is a mandatory attribute');
    });
});

test.skip('Test #5 - Insert user without email', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email is a mandatory attribute');
    });
});

test.skip('Test #6 - Insert user without password', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password is a mandatory attribute');
    });
});

test.skip('Test #7 - Insert user without role', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Role is a mandatory attribute');
    });
});

test.skip('Test #8 - Save encryped password', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', password: '123456', role: '1',
    })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123456');
});

test.skip('Test #9 - Insert duplicated users', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company: 'Onboard', name: 'João Rodrigues', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicated on BD');
    });
});

test.skip('Test #10 - Update user', () => {
  return app.db('users')
    .insert({
      company: 'Onboard', name: 'João Rodrigues - Update', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    }, ['id'])
    .then((acc) => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Account updated' }))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test.skip('Test #11 - Delete user', () => {
  return app.db('users')
    .insert({
      company: 'Onboard', name: 'João Rodrigues - Remove', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role: '1',
    }, ['id'])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Account updated' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test.skip('Test #11 - Restrict the access from another user', () => { });

test.skip('Test #12 - Restrict edition of another user', () => { });

test.skip('Test #13 - Restrict deletion of another user', () => { });

test.skip('Test #14 - Insert an user with the right role permitions', () => { });

test.skip('Test #15 - Restrict permitions for roles', () => { });
