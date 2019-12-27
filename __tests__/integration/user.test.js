import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/User';
import truncate from '../utils/truncate';

describe('User', () => {
  beforeAll(async () => {
    await truncate();
  });

  const name = `Newerton Vargas de Araujo`;
  const email = `newerton.araujo@gmail.com`;
  const password = 'abc123';

  it('should be able to register', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        name,
        email,
        password,
        provider: false,
      });

    expect(response.body).toHaveProperty('id');
    done();
  });

  it('should encrypt user password when user created', async done => {
    const user = await User.findOne({
      where: { email },
    });

    const compareHash = await bcrypt.compare(password, user.password_hash);
    expect(compareHash).toBe(true);
    done();
  });

  it('should not be able to register with duplicated email', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        name,
        email,
        password,
        provider: false,
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should not be able to register if validation fail', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        name,
        email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Validation fails' });
    done();
  });
});
