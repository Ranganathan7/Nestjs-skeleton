import { CallHandler, ExecutionContext } from "@nestjs/common";
import { HeaderInterceptor } from "./header.interceptor";

const interceptor = new HeaderInterceptor();
const mockJson = jest.fn();

const mockPipe = jest.fn().mockImplementation(() => ({
    json: mockJson
}));

const mockHandle = jest.fn().mockImplementation(() => ({
    pipe: mockPipe
}));

const callHandler: CallHandler = {
    handle: mockHandle
};

const executionContext: ExecutionContext = {
    getClass: jest.fn().mockReturnThis(),
    getHandler: jest.fn().mockReturnThis(),
    switchToHttp: jest.fn().mockReturnThis(),
    getArgs: jest.fn().mockReturnThis(),
    getArgByIndex: jest.fn().mockReturnThis(),
    switchToRpc: jest.fn().mockReturnThis(),
    switchToWs: jest.fn().mockReturnThis(),
    getType: jest.fn().mockReturnThis(),
}

describe('Header Interceptor', () => {
    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('call header interceptor', async () => {
        interceptor.intercept(executionContext, callHandler)
        expect(mockHandle).toBeCalledTimes(1);
        expect(mockPipe).toBeCalledTimes(1);
    });
})

