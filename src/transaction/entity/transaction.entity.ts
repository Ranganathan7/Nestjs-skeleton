import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  fromAccountId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  toAccountId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop({ required: true, type: Number, min: 1 })
  amount: number;

  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: 'Transaction' })
  parentTransaction: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// to autopopulate the parentTrasaction
TransactionSchema.pre(/^find/, function (next) {
  this.populate({ path: 'parentTransaction', model: 'Transaction' });
  next();
});
