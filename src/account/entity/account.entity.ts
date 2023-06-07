import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Account extends Document {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  accountId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  customerId: string;

  @IsNumber()
  @Min(0)
  @Prop({ default: 0, min: 0, type: Number })
  balanceAmount: number;

  @IsArray()
  @Type(() => IsMongoId())
  @ValidateNested({ each: true })
  @Prop([{ type: Types.ObjectId, ref: 'Transaction', required: true }])
  transactions: Types.ObjectId[];

  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: 'Bank', required: true })
  bank: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// to autopopulate the bank and transactions details
AccountSchema.pre(/^find/, function (next) {
  this.populate({ path: 'transactions', model: 'Transaction' }).populate({
    path: 'bank',
    model: 'Bank',
  });
  next();
});
