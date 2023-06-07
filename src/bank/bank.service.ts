import { Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import { Logger } from 'winston';
import { CrudService } from '../common/templates/crud.service';
import { Bank } from './entity/bank.entity';
import { BankRepository } from './repository/bank.repository';

@Injectable()
export class BankService extends CrudService<Bank> {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly bankRepository: BankRepository,
  ) {
    super(bankRepository, logger);
  }

  // overwrite/add new methods/routes if needed
}
