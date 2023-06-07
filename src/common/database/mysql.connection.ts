import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { CONSTANTS } from '../config/configuration';
import { LOGGER } from '../core.module';
import { Database } from '../models/config.models';
import * as mysqldb from 'mysql2/promise'
const fs = require('fs');
const path = require('path');

class MysqlDBConnection {

    private static instance: MysqlDBConnection;
    private mysqlPool: mysqldb.Pool;

    private constructor(@Inject(LOGGER) private readonly logger: Logger,
        private readonly configService: ConfigService) {
        this.init()
            .then(
                res => this.logger.info(`[MysqlDBConnection]: connection pool created successfully ${res}`),
                error => this.logger.error(`[MysqlDBConnection]: connection pool creation failed with error: ${error}`)
            )
    }

    static getInstance(logger?: Logger, configService?: ConfigService): MysqlDBConnection {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new MysqlDBConnection(logger, configService);
        return this.instance;
    }

    private async init(): Promise<mysqldb.Pool> {
        let createPool: mysqldb.Pool;
        let sslOptions;
        try {
            //console.log( df.d('QCagu+QLRC6cDOWFuqi58DU5mV0vGk6Jq7iYyOp7dICtsow/UreahuM4OPCnY8Fx9Sl+sNhj'));
            const dbConnectionConfig = this.configService.get<Database>(CONSTANTS.CONFIG.DATABASE, { infer: true })
            const sslCheck = this.configService.get('database.useSsl')
            if (sslCheck) {
                //console.log(path.resolve(this.configService.get('database.ssl.key')))
                sslOptions = {
                    key: fs.readFileSync(path.resolve(this.configService.get('databaseSsl.key'))),
                    cert: fs.readFileSync(path.resolve(this.configService.get('databaseSsl.cert'))),
                    ca: fs.readFileSync(path.resolve(this.configService.get('databaseSsl.ca')))
                }
                createPool = this.mysqlPool = mysqldb.createPool({ ...dbConnectionConfig, ...{ ssl: sslOptions } })
            }

            else createPool = this.mysqlPool = mysqldb.createPool({ ...dbConnectionConfig })
            this.logger.info(`[MysqlDBConnection]: Creating database pool with connectinConfig: ${JSON.stringify(dbConnectionConfig)}`)
            //createPool = this.mysqlPool = mysqldb.createPool(dbConnectionConfig)
            return createPool;
        } catch (error) {
            this.logger.error(`[MysqlDBConnection]: Error while initializing the db pool connection: ${error}`)
            throw new InternalServerErrorException({
                message: 'Error while initializing the db pool connection',
                log: `[OracleDBConnection]: Error while initializing the db pool connection: ${error}`
            })

        }

    }

    public async getDBConnection(): Promise<mysqldb.PoolConnection> {
        try {
            return await this.mysqlPool.getConnection()
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while get connection from pool with alias`,
                log: `[OracleDBConnection]: Error while get connection from pool with alias: ${error}`
            })

        }
    }

    public async execute(query: string, options?: any): Promise<any> {
        let conn: mysqldb.PoolConnection
        //console.log(conn)
        try {
            conn = await this.getDBConnection()
            // Formatting mysql query
            //console.log(query, options)
            const exeQuery = mysqldb.format(query, options);
            // Query database using promises
            const [rows, fields] = await conn.execute(exeQuery)
            //console.log(rows, fields)
            return rows
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while execute query`,
                log: `[OracleDBConnection]: Error while execute query: ${error}`
            })
        }
        finally {
            try {
                if (typeof conn !== 'undefined' && conn) {
                    conn.release();
                }
            } catch (err) {
                this.logger.error(`[MysqlDBConnection]: Error while closing connection with pool: ${err}`)
            }
        }
    }

    public async shutdown(): Promise<void> {
        try {
            return await (this.mysqlPool.end())
        } catch (error) {
            this.logger.error(`[MysqlDBConnection]: Error while shutting down connection pool: ${error}`)
            throw new InternalServerErrorException({
                message: `Error while shutting down connection pool`,
                log: `[OracleDBConnection]: Error while shutting down connection pool: ${error}`
            })
        }
    }
}

export default MysqlDBConnection;