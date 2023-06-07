import { Injectable } from '@nestjs/common';
import { CrudRepository } from './crud.repository';
import { Logger } from 'winston';

@Injectable()
export class CrudService<T> {
  private entityName: string;

  constructor(
    private readonly crudRepository: CrudRepository<T>,
    private readonly crudLogger: Logger,
  ) {
    this.entityName = (this.constructor as typeof CrudService).name;
  }

  async findAll(requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities.`,
      [requestId],
    );
    try {
      return await this.crudRepository.findAll(requestId);
    } catch (error) {
      throw error;
    }
  }

  async findMany(filter: any, requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities using filters.`,
      [requestId],
    );
    try {
      return this.crudRepository.findMany(filter, requestId);
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    value: string,
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudRepository.findOne(
        value,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  async create(
    data: T,
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to create an entity.`,
      [requestId],
    );
    try {
      return await this.crudRepository.create(data, requestId, fieldIdentifier);
    } catch (error) {
      throw error;
    }
  }

  async createMany(
    data: T[],
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<any> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to create many entities.`,
      [requestId],
    );
    try {
      return await this.crudRepository.createMany(
        data,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<T>,
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to update an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudRepository.update(
        id,
        data,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(
    fieldValue: string,
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<string> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to delete an entity using id.`,
      [requestId],
    );
    try {
      return await this.crudRepository.remove(
        fieldValue,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }
}
