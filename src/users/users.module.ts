import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User]
    )
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor
    }
  ]
})
export class UsersModule {}
