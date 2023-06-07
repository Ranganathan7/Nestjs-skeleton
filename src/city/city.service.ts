import { Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import { Logger } from 'winston';
import { CrudService } from '../common/templates/crud.service';
import { CityRepository } from './repository/city.repository';
import { City } from './entity/city.entity';

@Injectable()
export class CityService extends CrudService<City> {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly cityRepository: CityRepository,
  ) {
    super(cityRepository, logger);
  }

  // overwrite/add new methods/routes if needed
}
