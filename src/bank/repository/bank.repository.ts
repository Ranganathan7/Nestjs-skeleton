import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { CrudRepository } from '../../common/templates/crud.repository';
import { Logger } from 'winston';
import { Bank } from '../entity/bank.entity';

export class BankRepository extends CrudRepository<Bank> {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {
    super(bankModel, logger);
  }

  // overwrite/add new methods/routes if needed
}
