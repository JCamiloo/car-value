import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';

const FAKE_EMAIL = 'test@test.com';
const FAKE_PASSWORD = 'test';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password
        } as User;

        users.push(user);

        return Promise.resolve(user);
      }
    };
  
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();
  
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(FAKE_EMAIL, FAKE_PASSWORD);

    expect(user.password).not.toEqual('test');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', (done)  => {
    service.signup(FAKE_EMAIL, FAKE_PASSWORD).then(() => {
      service.signup(FAKE_EMAIL, FAKE_PASSWORD).catch(() => done());
    });
  });

  it('throws if signin is called with an unused email', (done) => {
    service.signin(FAKE_EMAIL, FAKE_PASSWORD).catch(() => done());
  });

  it('throws if an invalid password is provided', (done) => {
    service.signup(FAKE_EMAIL, FAKE_PASSWORD).then(() => {
      service.signin(FAKE_EMAIL, '1234').catch(() => done());
    });
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup(FAKE_EMAIL, FAKE_PASSWORD);

    const user = await service.signin(FAKE_EMAIL, FAKE_PASSWORD);
    
    expect(user).toBeDefined();
  });
})
