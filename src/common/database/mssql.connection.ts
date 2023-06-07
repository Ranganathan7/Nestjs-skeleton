import { Inject, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "winston";
import { LOGGER } from "../core.module";
import { Database } from "../models/config.models";
import { CONSTANTS } from "../config/configuration";
import * as sql from 'mssql'

class MsSqlDBConnection {
    private static instance: MsSqlDBConnection;

    private pool: sql.ConnectionPool
    private constructor(@Inject(LOGGER) private readonly logger: Logger,
        private readonly configService: ConfigService) {
        this.init()
            .then(
                res => {
                    this.logger.info(`[MsSqlDBConnection]: connection pool created successfully ${res.pool}`)
                    this.pool = res
                }
            ).catch(error => this.logger.error(`[MsSqlDBConnection]: connection pool creation failed with error: ${error}`)
            )
    }
    static getInstance(logger?: Logger, configService?: ConfigService): MsSqlDBConnection {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new MsSqlDBConnection(logger, configService);
        return this.instance;
    }

    private async init() {
        try {
            const dbConnectionConfig = this.configService.get<Database>(CONSTANTS.CONFIG.DATABASE, { infer: true })
            this.logger.info(`[MsSqlDBConnection]: Creating database pool with config: [user: ${dbConnectionConfig.user}] [PoolMin: ${dbConnectionConfig.pool.min} PoolMax: ${dbConnectionConfig.pool.max}`)
            this.logger.debug(`[MsSqlDBConnection]: Connection config ${JSON.stringify(dbConnectionConfig)}`)
            const result = await new sql.ConnectionPool(dbConnectionConfig).connect()
            return result
        } catch (error) {
            this.logger.error(`[MsSqlDBConnection]: Error while initializing the db pool connection: ${error}`)
            throw new InternalServerErrorException({
                message: 'Error while initializing the db pool connection',
                log: `[MsSqlDBConnection]: Error while initializing the db pool connection: ${error}`
            })
        }
    }

    public async getDBConnection() {
        try {
            if (this.pool.connected) {
                return this.pool.request()
            }
        } catch (error) {
            this.logger.error(`[MsSqlDBConnection]: Error while get connection : ${error}`)
            throw new InternalServerErrorException({
                message: `Error while get connection `,
                log: `[MsSqlDBConnection]: Error while get connection : ${error}`

            })
        }
    }

    public async execute(query: string, bindParams: any): Promise<sql.IResult<any>> {
        let connection: sql.Request
        try {
            connection = await this.getDBConnection()
            const result = await connection.input(bindParams?.paramName, bindParams?.paramType, bindParams?.paramValue).query(query)
            return result
        } catch (error) {
            this.logger.error(`[MsSqlDBConnection]: Error while execute query: ${error}`)
            throw new InternalServerErrorException({
                message: `Error while execute query`,
                log: `[MsSqlDBConnection]: Error while execute query: ${error}`
            })
        }
    }

    public async shutdown(): Promise<void> {
        try {
            return await this.pool.close()
        } catch (error) {
            this.logger.error(`[MsSqlDBConnection]: Error while shutting down connection pool: ${error}`)
            throw new InternalServerErrorException({
                message: `Error while shutting down connection pool`,
                log: `[MsSqlDBConnection]: Error while shutting down connection pool: ${error}`
            })
        }
    }
}

export default MsSqlDBConnection