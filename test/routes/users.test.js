const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';
const email = `${Date.now()}@tester.com`;

let user;
let user2;
const TOKEN3 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDMsIm5hbWUiOiJjb21lcmNpYWwxIiwiZW1haWwiOiJjeHB0b0B4cHRvLmNvbSJ9.58xz5xufiF6nTt-r5NPJi1Wt5LZLClo9XVN-2sfrmHg';

beforeAll(async () => {
  const res = await app.services.user.save({
    company_id: '1', name: 'User Account tester', email: `${Date.now()}@tester.com`, password: '123456', role_id: '1',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'onBoardIsCool!');
  const res2 = await app.services.user.save({
    company_id: '1', name: 'User Account tester2', email: `${Date.now()}@tester.com`, password: '123456', role_id: '2',
  });
  user2 = { ...res2[0] };
  user2.token = jwt.encode(user2, 'onBoardIsCool!');
});

test('Test #1 - List all users', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Insert users', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company_id: '1', name: 'João Rodrigues', email, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('João Rodrigues');
      expect(res.body).not.toHaveProperty('password');
    });
});

describe(' Test #3 - Insert user without attributes...', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send({
        company_id: 1, name: 'João Rodrigues # Inserts', email, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2', ...newData,
      })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #3.1 - Insert user without company', () => testTemplate({ company_id: null }, 'Company is a mandatory attribute'));
  test('Test #3.2 - Insert user without name', () => testTemplate({ name: null }, 'Name is a mandatory attribute'));
  test('Test #3.3 - Insert user without email', () => testTemplate({ email: null }, 'Email is a mandatory attribute'));
  test('Test #3.4 - Insert user without password', () => testTemplate({ password: null }, 'Password is a mandatory attribute'));
  test('Test #3.5 - Insert user without role', () => testTemplate({ role_id: null }, 'Role is a mandatory attribute'));
});

test('Test #4 - Save encryped password', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({
      company_id: '1', name: 'João Rodrigues #encrypted pwd', email: `${Date.now()}@tester.com`, password: '123456', role_id: '2',
    })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123456');
});

test('Test #5 - Insert duplicated users', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company_id: '1', name: 'João Rodrigues', email, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicated on BD');
    });
});

test('Test #6 - Update user', () => {
  return request(app).put(`${MAIN_ROUTE}/10003`)
    .set('authorization', `bearer ${TOKEN3}`)
    .send({ name: 'User updated' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('User updated');
    });
});

test('Test #7 - Delete user', () => {
  return request(app).delete(`${MAIN_ROUTE}/10003`)
    .set('authorization', `bearer ${TOKEN3}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Test #8 - Restrict the access from another user', () => {
  const email2 = `${Date.now()}@tester.com`;
  return app.db('users')
    .insert({
      company_id: '1', name: 'Tiago Rodrigues - #User2', email: email2, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    }, ['id'])
    .then((usr) => request(app).get(`${MAIN_ROUTE}/${usr[0].id}`)
      .set('authorization', `bearer ${user2.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Access denied');
    });
});

test('Test #9 - Restrict edition of another user', () => {
  const email2 = `${Date.now()}@tester.com`;
  return app.db('users')
    .insert({
      company_id: '1', name: 'Tiago Rodrigues - #User2', email: email2, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    }, ['id'])
    .then((usr) => request(app).put(`${MAIN_ROUTE}/${usr[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Access denied');
    });
});

test('Test #10 - Restrict deletion of another user', () => {
  const email2 = `${Date.now()}@tester.com`;
  return app.db('users')
    .insert({
      company_id: '1', name: 'Tiago Rodrigues - #User2', email: email2, password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    }, ['id'])
    .then((usr) => request(app).delete(`${MAIN_ROUTE}/${usr[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Access denied');
    });
});

test.skip('Test #11 - Insert an user with the right role_id permitions', () => {
  request(app).post(MAIN_ROUTE)
    .insert({ name: 'Jorge Rodrigues #Role 1', role_id: '1' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body[0].role_id).toBe('1');
    });
});

test.skip('Test #12 - Insert an user without the role permitions', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      company_id: '1', name: 'João Rodrigues #Insert', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('This user does not have permition');
    });
});

test.skip('Test #13 - Restrict delete permitions for roles', () => {
  return app.db('users')
    .insert({
      company_id: '1', name: 'João Rodrigues #Insert', email: 'joaorodrigues@onboard.com', password: '$2a$10$ieGCSPJoXUdecZwrrwdRbua7an/AizIC1qBREyOHuPSXTZNk1atti', role_id: '2',
    }, ['id'])
    .then((usr) => request(app).delete(`${MAIN_ROUTE}/${usr[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Does not have the permition to the requested resource');
    });
});
