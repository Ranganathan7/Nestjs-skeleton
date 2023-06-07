import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CrudService } from './crud.service';
import { Logger } from 'winston';
import { CONSTANTS } from '../config/configuration';
import { HeaderInterceptor } from '../interceptors/header.interceptor';

@Controller({
  path: CONSTANTS.ROUTES.CRUD_TEMPLATE.CONTROLLER,
  version: CONSTANTS.ROUTES.CRUD_TEMPLATE.VERSION,
})
@UsePipes(new ValidationPipe({ whitelist: true })) // for dto validations
@UseInterceptors(HeaderInterceptor) // to set requestId in request headers
export class CrudController<T> {
  private entityName: string;

  constructor(
    private readonly crudService: CrudService<T>,
    private readonly crudLogger: Logger,
    private readonly fieldIdentifier?: string,
  ) {
    this.entityName = (this.constructor as typeof CrudController).name;
  }

  @Get()
  async findAll(@Headers() headers: Headers): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities.`,
      [requestId],
    );
    try {
      return await this.crudService.findAll(requestId);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudService.findOne(
        id,
        requestId,
        this.fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  async findMany(
    @Query() filter: any,
    @Headers() headers: Headers,
  ): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities using filters.`,
      [requestId],
    );
    try {
      return await this.crudService.findMany(filter, requestId);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@Body() data: T, @Headers() headers: Headers): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to create an entity.`,
      [requestId],
    );
    try {
      return await this.crudService.create(
        data,
        requestId,
        this.fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/batch')
  async createMany(
    @Body() data: T[],
    @Headers() headers: Headers,
  ): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to create many entities.`,
      [requestId],
    );
    try {
      return await this.crudService.createMany(
        data,
        requestId,
        this.fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<T>,
    @Headers() headers: Headers,
  ): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to update an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudService.update(
        id,
        data,
        requestId,
        this.fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<string> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}]: Api called to delete an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudService.remove(id, requestId, this.fieldIdentifier);
    } catch (error) {
      throw error;
    }
  }
}
