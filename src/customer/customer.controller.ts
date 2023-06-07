import {
  Controller,
  Inject,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LOGGER } from '../common/core.module';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CustomerService } from './customer.service';
import { Logger } from 'winston';
import { Customer } from './entity/customer.entity';
import { CrudController } from '../common/templates/crud.controller';
import { CONSTANTS } from '../common/config/configuration';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@ApiTags(CONSTANTS.ROUTES.CUSTOMER.TAG)
@UseFilters(CommonExceptionFilter)
@Controller({
  path: CONSTANTS.ROUTES.CUSTOMER.CONTROLLER,
  version: CONSTANTS.ROUTES.CUSTOMER.VERSION,
})
@UseInterceptors(TransformInterceptor)
export class CustomerController extends CrudController<Customer> {
  constructor(
    private readonly customerService: CustomerService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(customerService, logger, 'customerId');
  }

  // overwrite/add new methods/routes if needed
}
