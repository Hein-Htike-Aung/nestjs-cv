import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export interface ClassConstructor {
  new (...args: any[]): {};
}

export const Serialize = (customClass: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(customClass));
};
