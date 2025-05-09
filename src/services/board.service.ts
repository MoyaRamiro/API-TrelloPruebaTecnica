import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Boards, BoardDocument } from '../schemas/board.schema';
import { v4 as uuidv4 } from 'uuid';
import { BoardData } from 'src/types/boardData';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Boards.name) private boardsModel: Model<BoardDocument>,
  ) {}

  async findAll(): Promise<BoardData[]> {
    return this.boardsModel
      .findOne({ id: 1 })
      .exec()
      .then((board) => board?.boards || []);
  }

  async update(board: BoardData[]) {
    const updatedBoard = await this.boardsModel
      .replaceOne({ id: 1 }, { boards: board, id: 1 }, { upsert: true })
      .exec();

    if (!updatedBoard) {
      throw new Error('Error al actualizar el board');
    }
  }

  async initializeDefaultBoards() {
    const result = await this.boardsModel.find();

    if (result.length === 0) {
      const defaultBoards = [
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

      await this.boardsModel.replaceOne(
        { id: 1 },
        { boards: defaultBoards, id: 1 },
        { upsert: true },
      );
    }
  }
}
