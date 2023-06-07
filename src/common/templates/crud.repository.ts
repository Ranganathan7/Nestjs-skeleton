import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { flatten } from 'safe-flat';
import { Logger } from 'winston';

@Injectable()
export class CrudRepository<T> {
  private entityName: string;

  constructor(
    private readonly crudModel: Model<T>,
    private readonly crudLogger: Logger,
  ) {
    this.entityName = (this.constructor as typeof CrudRepository).name;
  }

  async findAll(requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities.`,
      [requestId],
    );
    try {
      return await this.crudModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }

  async findMany(
    filter: any = { $and: [{ isActive: true }] },
    requestId: string,
  ): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to fetch all entities using filters.`,
      [requestId],
    );
    try {
      return await this.crudModel.find(filter).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
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
      return await this.crudModel
        .findOne({
          $and: [
            { isActive: true },
            this.createFindObject(value, fieldIdentifier),
          ],
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
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
      const res = await this.findOne(
        data[`${fieldIdentifier}`],
        requestId,
        fieldIdentifier,
      );
      if (res) {
        throw new ConflictException({
          error: { description: 'Data already exists' },
          requestId,
        });
      }
      return await this.crudModel.create(data);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error,
          requestId,
        });
      }
    }
  }

  async createMany(
    data: T[],
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<T | any> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to create many entities.`,
      [requestId],
    );
    try {
      let response = await this.findAll(requestId);
      let bulkObj = [];
      data.forEach(async (element) => {
        let flag = 0;
        response.every(async (item) => {
          if (element[`${fieldIdentifier}`] == item[`${fieldIdentifier}`]) {
            flag = 1;
            return false;
          }
        });
        if (flag == 0) {
          let insertDoc = {
            insertOne: {
              document: element,
            },
          };
          bulkObj.push(insertDoc);
        }
      });
      const records = await this.crudModel.bulkWrite(bulkObj);

      if (!records) {
        throw new ConflictException({
          error: { description: `Bulk data not created` },
          requestId,
        });
      }
      return records;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error,
          requestId,
        });
      }
    }
  }

  async update(
    fieldValue: string,
    data: Partial<T>,
    requestId: string,
    fieldIdentifier: string = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}]: Api called to update an entity using id.`,
      [requestId],
    );
    try {
      const res: any = await this.findOne(
        fieldValue,
        requestId,
        fieldIdentifier,
      );
      if (!res) {
        throw new BadRequestException({
          error: {
            description: 'Entity not found to update',
          },
          requestId,
        });
      }
      return await this.crudModel
        .findOneAndUpdate(
          this.createFindObject(fieldValue, fieldIdentifier),
          flatten(JSON.parse(JSON.stringify({ ...res._doc, ...data }))),
          { upsert: true, new: true, overwrite: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
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
      const deletedEntity = await this.crudModel
        .findOneAndRemove(this.createFindObject(fieldValue, fieldIdentifier))
        .exec();
      if (!deletedEntity) return 'No record found to delete';
      else return 'Deleted record successfully!';
    } catch (error) {
      throw new InternalServerErrorException({
        error: { description: error.toString() },
        requestId,
      });
    }
  }

  createFindObject(fieldValue: string, fieldIdentifier: string) {
    const findObject: Object = {};
    findObject[`${fieldIdentifier}`] = fieldValue;
    return findObject;
  }

  // Use this method to throw custom errors
  private handleError(message: string, requestId: string, statusCode: number) {
    throw new HttpException({ message, requestId }, statusCode);
  }
}
