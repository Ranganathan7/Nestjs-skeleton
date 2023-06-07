import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './entity/city.entity';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityRepository } from './repository/city.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService, CityRepository],
})
export class CityModule {}
