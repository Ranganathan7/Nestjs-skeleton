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
export class City extends Document {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  cityName: string;

  @IsArray()
  @Type(() => IsMongoId())
  @ValidateNested({ each: true })
  @Prop([{ type: Types.ObjectId, ref: 'Bank', required: true }])
  banks: Types.ObjectId[];
}

export const CitySchema = SchemaFactory.createForClass(City);

// to autopopulate the locatedCities details
CitySchema.pre(/^find/, function (next) {
  this.populate({ path: 'banks', model: 'Bank', select: '-locatedCities' });
  next();
});
