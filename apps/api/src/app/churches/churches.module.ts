import { Module } from '@nestjs/common';
import { ChurchesResolver } from './churches.resolver';

@Module({
  providers: [
    ChurchesResolver 
  ]
})
export class ChurchesModule {}
