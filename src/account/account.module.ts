import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './entity/account.entity';
import { AccountController } from './account.controller';
import { AccountRepository } from './repository/account.repository';
import { AccountService } from './account.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { Customer, CustomerSchema } from '../customer/entity/customer.entity';
import { Bank, BankSchema } from '../bank/entity/bank.entity';
import { BankRepository } from '../bank/repository/bank.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Bank.name, schema: BankSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountRepository,
    CustomerRepository,
    BankRepository,
  ],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
