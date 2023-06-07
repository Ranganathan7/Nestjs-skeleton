import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sqlite3 from 'sqlite3'
import { Logger } from 'winston';
import { LOGGER } from '../core.module';

class SqliteDBConnection {

    private static instance: SqliteDBConnection;
    private db: sqlite3.Database;
    private sqlite = sqlite3.verbose()

    private constructor(@Inject(LOGGER) private readonly logger: Logger,
        private readonly configService: ConfigService) {
    }

    static getInstance(logger?: Logger, configService?: ConfigService): SqliteDBConnection {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new SqliteDBConnection(logger, configService);
        return this.instance;
    }


    public async execute(query: string, bindParams?): Promise<any> {
        let db: sqlite3.Database;
        return await new Promise((resolve, rejects) => {
            db = new this.sqlite.Database(':memory:');
            db.serialize(function () {
                const query_array = query.split(';');
                query_array.pop();
            })
        })
    }
}

export default SqliteDBConnection;

