import { CallHandler, ExecutionContext, RequestTimeoutException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { lastValueFrom, of, throwError } from "rxjs";
import { createMock } from "@golevelup/ts-jest";
import { TimeoutInterceptor } from "./timeout.interceptor";
import { ConfigService } from "@nestjs/config";

let interceptor: TimeoutInterceptor
let config: ConfigService

describe('Timeout Interceptor', () => {

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation(() => 30000)
                    }
                },
            ],
        }).compile();
        config = module.get<ConfigService>(ConfigService)
        interceptor = new TimeoutInterceptor(config);
    })
    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('call interceptor', async () => {
        const context = createMock<ExecutionContext>()
        const handler = createMock<CallHandler>({
            handle: () => throwError(() => new RequestTimeoutException())
        })

        try {
            const observableValue = interceptor.intercept(context, handler)
            const result = await lastValueFrom(observableValue)

        } catch (error) {
            expect(error).toBeInstanceOf(RequestTimeoutException)

        }
    })
})

