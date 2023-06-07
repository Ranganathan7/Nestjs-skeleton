import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { CrudRepository } from '../../common/templates/crud.repository';
import { Logger } from 'winston';
import { Transaction } from '../entity/transaction.entity';

export class TransactionRepository extends CrudRepository<Transaction> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {
    super(transactionModel, logger);
  }

  // overwrite/add new methods/routes if needed
}
