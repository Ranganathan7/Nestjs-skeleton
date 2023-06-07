import { ConfigService } from "@nestjs/config";
import { Logger } from "winston";
import MsSqlDBConnection from "./mssql.connection";
import MysqlDBConnection from "./mysql.connection";
import OracleDBConnection from "./oracledb.connection";
import SqliteDBConnection from "./sqlite.connection";

export const DB_CONSTANTS = {
    ORACLE_DB: 'oracleDb',
    SQLITE_DB: 'sqliteDb',
    MYSQL_DB: 'mysqlDb',
    MSSQL_DB: 'mssqlDb'

}
export type DBConnection = OracleDBConnection | SqliteDBConnection | MysqlDBConnection | MsSqlDBConnection

export function getDbClass(dbName: string, logger?: Logger, configService?: ConfigService): DBConnection {
    switch (dbName) {
        case DB_CONSTANTS.ORACLE_DB:
            return OracleDBConnection.getInstance(logger, configService)
        case DB_CONSTANTS.SQLITE_DB:
            return SqliteDBConnection.getInstance(logger, configService)
        case DB_CONSTANTS.MYSQL_DB:
            return MysqlDBConnection.getInstance(logger, configService)
        case DB_CONSTANTS.MSSQL_DB:
            return MsSqlDBConnection.getInstance(logger, configService)
    }
}