import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Bank extends Document {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  bankId: string;

  @IsArray()
  @Type(() => IsMongoId())
  @ValidateNested({ each: true })
  @Prop([{ type: Types.ObjectId, ref: 'City', required: true }])
  locatedCities: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  bankContactNo: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);

// to autopopulate the locatedCities details
BankSchema.pre(/^find/, function (next) {
  this.populate({ path: 'locatedCities', model: 'City', select: '-banks' });
  next();
});
