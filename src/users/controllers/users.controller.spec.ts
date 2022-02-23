import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users/users.service';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../entities/user.entity';

const FAKE_EMAIL = 'test@test.com';
const FAKE_PASSWORD = 'test';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: FAKE_EMAIL, password: FAKE_PASSWORD} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: FAKE_PASSWORD } as User])
      },
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with the given email', async () => {
    const users = await controller.findAll(FAKE_EMAIL);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(FAKE_EMAIL);
  })

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.find('1');

    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', (done) => {
    fakeUsersService.findOne = () => null;

    controller.find('1').catch(() => done());
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: null};
    const user = await controller.signin(
      { email: FAKE_EMAIL,password: FAKE_PASSWORD },
      session
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
