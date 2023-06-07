import { CallHandler, ExecutionContext } from "@nestjs/common";
import { TransformInterceptor } from "./transform.interceptor";
import { ApiSuccessResponse } from "../models/api.models";
import { Test, TestingModule } from "@nestjs/testing";
import { assert } from "chai";
import { lastValueFrom, of } from "rxjs";

let interceptor: TransformInterceptor<ApiSuccessResponse<Record<string, unknown>>>

describe('Transform Interceptor', () => {

    beforeEach(async () => {
        interceptor = new TransformInterceptor();
    })



    it('should be defined', () => {

        expect(interceptor).toBeDefined();

    });

})