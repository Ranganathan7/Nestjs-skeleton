import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: String })
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  customerName: string;

  @IsMongoId()
  @Prop({ type: Types.ObjectId, ref: 'Account' })
  account: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// to autopopulate the account details
CustomerSchema.pre(/^find/, function (next) {
  this.populate({ path: 'account', model: 'Account' });
  next();
});
