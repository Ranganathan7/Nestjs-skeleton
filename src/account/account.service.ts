import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import { Logger } from 'winston';
import { CrudService } from '../common/templates/crud.service';
import { Account } from './entity/account.entity';
import { AccountRepository } from './repository/account.repository';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { BankRepository } from '../bank/repository/bank.repository';

@Injectable()
export class AccountService extends CrudService<Account> {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly accountRepository: AccountRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly bankRepository: BankRepository,
  ) {
    super(accountRepository, logger);
  }

  // overwrite/add new methods/routes if needed

  // overriding update method to not update / change accountId / customerId

  async update(
    id: string,
    data: Partial<Account>,
    requestId: string,
    fieldIdentifier: string = 'accountId',
  ): Promise<Account> {
    this.logger.info(
      `[AccountService]: Api called to update an entity using id.`,
      [requestId],
    );
    try {
      if (data.accountId || data.customerId) {
        throw new BadRequestException({
          error: {
            description: 'accountId/customerId field cannot be upated!',
          },
          requestId,
        });
      }
      return await this.accountRepository.update(
        id,
        data,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  // overriding create method to insert the created accountId to customer entity

  async create(
    data: Account,
    requestId: string,
    fieldIdentifier: string = 'accountId',
  ): Promise<Account> {
    this.logger.info(`[AccountService]: Api called to create an entity.`, [
      requestId,
    ]);
    try {
      // checking if customerId exists
      const customer = await this.customerRepository.findOne(
        data.customerId,
        requestId,
        'customerId',
      );
      if (!customer) {
        throw new BadRequestException({
          error: { description: 'Customer with provided customerId not found' },
          requestId,
        });
      }

      // checking if the bank exists
      const bank = await this.bankRepository.findOne(
        data.bank.toString(),
        requestId,
        '_id',
      );
      if (!bank) {
        throw new BadRequestException({
          error: { description: 'Bank with provided id not found' },
          requestId,
        });
      }

      // creating the account
      const account = await this.accountRepository.create(
        data,
        requestId,
        fieldIdentifier,
      );

      // adding the created accountId to customer
      await this.customerRepository.update(
        customer.customerId,
        { account: account._id },
        requestId,
        'customerId',
      );

      return account.populate({
        path: 'bank',
        model: 'Bank',
      });
    } catch (error) {
      throw error;
    }
  }
}
