import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BoardService } from '../services/board.service';
import { Boards } from '../schemas/board.schema';
import { BoardData } from 'src/types/boardData';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly boardService: BoardService) {}

  async afterInit(server: Server) {
    await this.boardService.initializeDefaultBoards();
    console.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('initialBoardData', await this.boardService.findAll());
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('boardUpdate')
  async handleMessage(@MessageBody() data: { boardData: BoardData[] }) {
    console.log('Datos recibidos:', data);

    await this.boardService.update(data.boardData);

    console.log(
      'Datos guardados en MongoDB',
      await this.boardService.findAll(),
    );

    return await this.boardService.findAll();
  }
}
