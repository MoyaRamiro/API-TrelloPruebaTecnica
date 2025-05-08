import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BoardData } from 'src/types/boardData';

export type BoardDocument = Boards & Document;

@Schema()
export class Boards {
  @Prop({ required: true })
  boards: BoardData[];

  @Prop({ required: true, unique: true })
  id: number;
}

export const BoardsSchema = SchemaFactory.createForClass(Boards);
