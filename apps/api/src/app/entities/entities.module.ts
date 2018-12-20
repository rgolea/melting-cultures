import { Module, HttpModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QueryService } from "../shared/query/query.service";
import { EntitiesResolver } from "./entities.resolver";
import { EntityCollection } from "./entity.interface";
import { EntitySchema } from "./entity.schema";
import { SessionService } from "../shared/session/session.service";
import { ChannelsModule } from "../channels/channels.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntityCollection, schema: EntitySchema }
    ]),
    ChannelsModule,
    HttpModule
  ],
  providers: [EntitiesResolver, QueryService, SessionService]
})
export class EntityModule {}
