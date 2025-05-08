import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { BoardData } from '../types/boardData';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  boardDataArray: BoardData[] = [
    {
      id: uuidv4(),
      title: 'Board 1',
      elements: [
        { id: uuidv4(), name: 'Estudiar', isChecked: false },
        { id: uuidv4(), name: 'Trabajar', isChecked: false },
        { id: uuidv4(), name: 'Hacer ejercicio', isChecked: true },
        { id: uuidv4(), name: 'Comprar comida', isChecked: true },
      ],
    },
    {
      id: uuidv4(),
      title: 'Board 2',
      elements: [
        { id: uuidv4(), name: 'Hacer prueba tecnica', isChecked: false },
        { id: uuidv4(), name: 'Producir', isChecked: false },
        { id: uuidv4(), name: 'Bailar zamba', isChecked: true },
        { id: uuidv4(), name: 'Jugar videojuegos', isChecked: false },
      ],
    },
    {
      id: uuidv4(),
      title: 'Board 3',
      elements: [
        { id: uuidv4(), name: 'Salir al parque', isChecked: true },
        { id: uuidv4(), name: 'Ver pelicula', isChecked: true },
        { id: uuidv4(), name: 'Andar a caballo', isChecked: true },
        { id: uuidv4(), name: 'Maradona', isChecked: true },
      ],
    },
  ];

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('initialBoardData', this.boardDataArray);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('boardUpdate')
  handleMessage(client: Socket, data: { boardData: BoardData[] }): void {
    console.log('Datos recibidos:', data);
    this.boardDataArray = data.boardData;
    this.server.emit('boardUpdate', data.boardData);
  }
}
