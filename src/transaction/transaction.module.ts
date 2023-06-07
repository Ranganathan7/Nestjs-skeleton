import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { Transaction, TransactionSchema } from './entity/transaction.entity';
import { TransactionController } from './transaction.controller';
import { Account, AccountSchema } from '../account/entity/account.entity';
import { AccountRepository } from '../account/repository/account.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, AccountRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
