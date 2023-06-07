import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { CrudRepository } from '../../common/templates/crud.repository';
import { Logger } from 'winston';
import { City } from '../entity/city.entity';

export class CityRepository extends CrudRepository<City> {
  constructor(
    @InjectModel(City.name) private readonly cityModel: Model<City>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {
    super(cityModel, logger);
  }

  // overwrite/add new methods/routes if needed
}
