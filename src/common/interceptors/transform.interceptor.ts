import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse, CommonApiResponse } from '../models/api.models';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CONSTANTS } from '../config/configuration';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const requestId = request.headers[CONSTANTS.REQUEST_ID] as string;
    const statusCode = context
      .switchToHttp()
      .getResponse<FastifyReply>().statusCode;
    const message = request.headers[CONSTANTS.MESSAGE] as string;

    return next.handle().pipe(
      map((response) => {
        return this.constuctResponse(response, requestId, statusCode, message);
      }),
    );
  }

  private constuctResponse(
    data: any,
    requestId: string,
    statusCode: number,
    message: string = 'Success!',
  ) {
    const response: CommonApiResponse<ApiSuccessResponse<typeof data>> = {
      statusCode,
      timestamp: new Date().toISOString(),
      requestId,
      message,
      data,
    };
    return response;
  }
}
