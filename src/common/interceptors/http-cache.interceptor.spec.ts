import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CoreModule } from "../core.module";
import { HttpCacheInterceptor } from "./http-cache.interceptor";

describe('Http-Cache interecptor', () => {
    let httpCache: HttpCacheInterceptor
    beforeEach(async () => {
        process.env.AWS_REGION = "ap-south-1"
        process.env.AWS_SECRETNAME = "uat/api-modernization-2"
        process.env.USE_AWS_SECRETS = "false"
        const config = () => ({
            database: {
                useDatabase: 'sqlite',
            },
            log: {
                app: {
                    level: 'info',
                    directoryMount: 'logs',
                    subDirectory: '',
                    filePrefix: 'combined',
                    errorFilePrefix: 'error',
                    timeZone: 'GMT 5:30',
                    datePattern: 'MM-DD-YYYY',
                    maxSize: '100m',
                    maxFile: '30d',
                    zippedArchive: true
                }
            },
        })

        const module: TestingModule = await Test.createTestingModule({
            imports: [CoreModule.forRoot({ loggerLabel: 'AccountStatement' }), CacheModule.register(), ConfigModule.forRoot({ load: [config] })],
            providers: [HttpCacheInterceptor]
        }).compile();

        httpCache = module.get<HttpCacheInterceptor>(HttpCacheInterceptor)
    })
    it('should be defined', () => {
        expect(httpCache).toBeDefined();
    });
})

