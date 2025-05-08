import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from './events.gateway';
import { Boards, BoardsSchema } from '../schemas/board.schema';
import { BoardService } from '../services/board.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://moya04ramiro:qz0wS61tO71hHRIE@phonebookapi.nfk4x.mongodb.net/trello?retryWrites=true&w=majority&appName=phonebookapi',
    ),
    MongooseModule.forFeature([{ name: Boards.name, schema: BoardsSchema }]),
  ],
  providers: [EventsGateway, BoardService],
})
export class EventsModule {}
