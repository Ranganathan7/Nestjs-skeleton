import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import { Logger } from 'winston';
import { CrudService } from '../common/templates/crud.service';
import { Transaction } from './entity/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import { AccountRepository } from '../account/repository/account.repository';

@Injectable()
export class TransactionService extends CrudService<Transaction> {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {
    super(transactionRepository, logger);
  }

  // overwrite/add new methods/routes if needed

  // overriding creation of transaction

  async create(
    data: Transaction,
    requestId: string,
    fieldIdentifier: string = 'transactionId',
  ): Promise<Transaction> {
    this.logger.info(`[TrasactionService]: Api called to create an entity.`, [
      requestId,
    ]);
    try {
      // checking if transaction is valid
      if (data.amount <= 0) {
        throw new BadRequestException({
          error: {
            description: 'To make a transaction, amount must be greater than 0',
          },
          requestId,
        });
      }
      if (data.toAccountId === data.fromAccountId) {
        throw new BadRequestException({
          error: {
            description: 'toAccountId and fromAccountId cannot be same',
          },
          requestId,
        });
      }

      // checking if toAccountId and fromAccountId exist to make the transaction
      const toAccount = await this.accountRepository.findOne(
        data.toAccountId,
        requestId,
        'accountId',
      );
      const fromAccount = await this.accountRepository.findOne(
        data.fromAccountId,
        requestId,
        'accountId',
      );
      if (!toAccount || !fromAccount) {
        throw new BadRequestException({
          error: { description: 'toAccountId/fromAccountId does not exist' },
          requestId,
        });
      }

      // checking if the customer trying to make transaction has enough balance
      if (fromAccount.balanceAmount < data.amount) {
        throw new BadRequestException({
          error: { description: 'Not enough balance to make this transaction' },
          requestId,
        });
      }

      // creating the transaction
      const transaction = await this.transactionRepository.create(
        data,
        requestId,
        fieldIdentifier,
      );

      // updating the balance of the accounts and adding the transaction id
      await this.accountRepository.updateTransactions(
        toAccount.accountId,
        {
          balanceAmount: toAccount.balanceAmount + transaction.amount,
          id: transaction._id,
        },
        requestId,
        'accountId',
      );
      await this.accountRepository.updateTransactions(
        fromAccount.accountId,
        {
          balanceAmount: fromAccount.balanceAmount - transaction.amount,
          id: transaction._id,
        },
        requestId,
        'accountId',
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
