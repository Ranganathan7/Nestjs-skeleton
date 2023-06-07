import {
  Controller,
  Delete,
  Inject,
  MethodNotAllowedException,
  Param,
  UseFilters,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LOGGER } from '../common/core.module';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Logger } from 'winston';
import { CrudController } from '../common/templates/crud.controller';
import { CONSTANTS } from '../common/config/configuration';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { BankService } from './bank.service';
import { Bank } from './entity/bank.entity';

@ApiTags(CONSTANTS.ROUTES.BANK.TAG)
@UseFilters(CommonExceptionFilter)
@Controller({
  path: CONSTANTS.ROUTES.BANK.CONTROLLER,
  version: CONSTANTS.ROUTES.BANK.VERSION,
})
@UseInterceptors(TransformInterceptor)
export class BankController extends CrudController<Bank> {
  constructor(
    private readonly bankService: BankService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(bankService, logger, 'bankId');
  }

  // overwrite/add new methods/routes if needed

  // Overriding methods that is not required for this collection by not implementing those methods

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<string> {
    throw new MethodNotAllowedException();
  }
}
