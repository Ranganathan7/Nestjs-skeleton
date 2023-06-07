import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import { Logger } from 'winston';
import { CustomerRepository } from './repository/customer.repository';
import { Customer } from './entity/customer.entity';
import { CrudService } from '../common/templates/crud.service';

@Injectable()
export class CustomerService extends CrudService<Customer> {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly customerRepository: CustomerRepository,
  ) {
    super(customerRepository, logger);
  }

  // overwrite/add new methods/routes if needed

  // overriding update method to not update account / customerId

  async update(
    id: string,
    data: Partial<Customer>,
    requestId: string,
    fieldIdentifier: string = 'accountId',
  ): Promise<Customer> {
    this.logger.info(
      `[CustomerService]: Api called to update an entity using id.`,
      [requestId],
    );
    try {
      if (data.account || data.customerId) {
        throw new BadRequestException({
          error: {
            description: 'account/customerId field cannot be upated!',
          },
          requestId,
        });
      }
      return await this.customerRepository.update(
        id,
        data,
        requestId,
        fieldIdentifier,
      );
    } catch (error) {
      throw error;
    }
  }

  // overriding create method to populate the referenced fields

  async create(
    data: Customer,
    requestId: string,
    fieldIdentifier: string = 'customerId',
  ): Promise<Customer> {
    const entity = await super.create(data, requestId, fieldIdentifier);
    return entity.populate({
      path: 'account',
      model: 'Account',
    });
  }
}
