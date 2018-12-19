import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QueryService } from "../shared/query/query.service";
import { EntitiesResolver } from "./entities.resolver";
import { EntityCollection } from "./entity.interface";
import { EntitySchema } from "./entity.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntityCollection, schema: EntitySchema }
    ])
  ],
  providers: [EntitiesResolver, QueryService]
})
export class EntityModule {}
