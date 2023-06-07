import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { Customer } from '../entity/customer.entity';
import { CrudRepository } from '../../common/templates/crud.repository';
import { Logger } from 'winston';

export class CustomerRepository extends CrudRepository<Customer> {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {
    super(customerModel, logger);
  }

  // overwrite/add new methods/routes if needed
}
