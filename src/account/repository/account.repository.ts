import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { CrudRepository } from '../../common/templates/crud.repository';
import { Logger } from 'winston';
import { Account } from '../entity/account.entity';

export class AccountRepository extends CrudRepository<Account> {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {
    super(accountModel, logger);
  }

  // overwrite/add new methods/routes if needed

  // adding a new method to update an account if a transaction is created

  async updateTransactions(
    fieldValue: string,
    data: { balanceAmount: number; id: string },
    requestId: string,
    fieldIdentifier: string = 'accountId',
  ): Promise<Account> {
    this.logger.info(
      `[AccountRepository]: Api called to update an entity using id.`,
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
      return await this.accountModel
        .findOneAndUpdate(
          this.createFindObject(fieldValue, fieldIdentifier),
          {
            $set: { balanceAmount: data.balanceAmount },
            $push: { transactions: data.id },
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }
}
