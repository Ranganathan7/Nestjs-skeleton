import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { BankController } from './bank.controller';
import { BankRepository } from './repository/bank.repository';
import { BankService } from './bank.service';
import { Bank, BankSchema } from './entity/bank.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
  ],
  controllers: [BankController],
  providers: [BankService, BankRepository],
  exports: [BankService, BankRepository],
})
export class BankModule {}
