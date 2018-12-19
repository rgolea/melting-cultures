import { ReflectMetadata } from '@nestjs/common';
import { ROLES } from './roles.enum';


export const Roles = (...args: ROLES[]) => ReflectMetadata('roles', args);
