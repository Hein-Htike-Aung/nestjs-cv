import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private customClass: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Before the request is handled

    return next.handle().pipe(
      map((responseObject: any) => {
        // bofore the response is send out

        // Map Response Object to Custom Dto
        return plainToInstance(this.customClass, responseObject, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
