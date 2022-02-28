import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const FAKE_EMAIL = 'test@test.com';
const FAKE_PASSWORD = 'test';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: FAKE_EMAIL, password: FAKE_PASSWORD})
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(FAKE_EMAIL).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: FAKE_EMAIL, password: FAKE_PASSWORD })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(FAKE_EMAIL);
  });
});



