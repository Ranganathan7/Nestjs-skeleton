import {
  Body,
  Post,
  Controller,
  Delete,
  Inject,
  Param,
  UseFilters,
  UseInterceptors,
  MethodNotAllowedException,
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
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@ApiTags(CONSTANTS.ROUTES.ACCOUNT.TAG)
@UseFilters(CommonExceptionFilter)
@Controller({
  path: CONSTANTS.ROUTES.ACCOUNT.CONTROLLER,
  version: CONSTANTS.ROUTES.ACCOUNT.VERSION,
})
@UseInterceptors(TransformInterceptor)
export class AccountController extends CrudController<Account> {
  constructor(
    private readonly accountService: AccountService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(accountService, logger, 'accountId');
  }

  // overwrite/add new methods/routes if needed

  // Overriding methods that is not required for this collection by not implementing those methods

  @Post('/batch')
  async createMany(
    @Body() data: Account[],
    @Headers() headers: Headers,
  ): Promise<Account[]> {
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
