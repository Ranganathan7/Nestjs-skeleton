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
import { City } from './entity/city.entity';
import { CityService } from './city.service';

@ApiTags(CONSTANTS.ROUTES.CITY.TAG)
@UseFilters(CommonExceptionFilter)
@Controller({
  path: CONSTANTS.ROUTES.CITY.CONTROLLER,
  version: CONSTANTS.ROUTES.CITY.VERSION,
})
@UseInterceptors(TransformInterceptor)
export class CityController extends CrudController<City> {
  constructor(
    private readonly cityService: CityService,
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(cityService, logger, 'cityName');
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
