import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
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
    console.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    await this.boardService.initializeDefaultBoards();
    console.log(`Client connected: ${client.id}`);
    this.server.emit('initialBoardData', await this.boardService.findAll());
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('boardUpdate')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardData: BoardData[] },
  ) {
    await this.boardService.update(data.boardData);
    client.broadcast.emit('update', data.boardData);
    console.log('emitiendo', data.boardData[0].elements);
  }
}
