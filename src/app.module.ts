import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import configuration, { CONSTANTS } from './common/config/configuration';
import { CoreModule } from './common/core.module';
import { StatusModule } from './status/status.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { CustomerModule } from './customer/customer.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { BankModule } from './bank/bank.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    // Import ConfigModule with global config. No need to import in other modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // Import CoreModule with global config. If you need to set different labels in different modules,
    // then you can import in other modules with correct label set.
    CoreModule.forRoot({ loggerLabel: CONSTANTS.LOG.LABEL }),
    // Enable cache Module
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('app.cache.ttl'),
        max: configService.get('app.cache.maxCount')
      }),
      inject: [ConfigService],
    }),
    StatusModule,
    CustomerModule,
    AccountModule,
    TransactionModule,
    BankModule,
    CityModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongoMemoryReplicaSetServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } })
        console.log(`MongoDB-In-Memory server available at URI: ${mongoMemoryReplicaSetServer.getUri()}`)
        return {
          uri: mongoMemoryReplicaSetServer.getUri(),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 50,
          connectTimeoutMS: 50,
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
