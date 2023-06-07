import {
  Body,
  Controller,
  Delete,
  Inject,
  MethodNotAllowedException,
  Param,
  Post,
  Put,
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
import { Transaction } from './entity/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@ApiTags(CONSTANTS.ROUTES.TRANSACTION.TAG)
@UseFilters(CommonExceptionFilter)
@Controller({
  path: CONSTANTS.ROUTES.TRANSACTION.CONTROLLER,
  version: CONSTANTS.ROUTES.TRANSACTION.VERSION,
})
@UseInterceptors(TransformInterceptor)
export class TransactionController extends CrudController<Transaction> {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(transactionService, logger, 'transactionId');
  }

  // overwrite/add new methods/routes if needed

  // Overriding methods that is not required for this collection by not implementing those methods

  @Post('/batch')
  async createMany(
    @Body() data: Transaction[],
    @Headers() headers: Headers,
  ): Promise<Transaction[]> {
    throw new MethodNotAllowedException();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Transaction>,
    @Headers() headers: Headers,
  ): Promise<Transaction> {
    throw new MethodNotAllowedException();
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<string> {
    throw new MethodNotAllowedException();
  }
}
