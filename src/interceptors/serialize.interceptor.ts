import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserDto } from '../users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true
        })
      })
    );
  }
}