import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { CONSTANTS } from '../config/configuration';

// This interceptor adds the headers coming in the api call / request to the list of response headers
@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = randomUUID();
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // setting requestId to headers
    request.headers[CONSTANTS.REQUEST_ID] = requestId;

    return next.handle().pipe(
      tap(() => {
        response.headers(request.headers);

        // To remove a header use removeHeader with the header key as parameter
        // Reference link - https://www.fastify.io/docs/latest/Reference/Reply/#introduction
        // response.removeHeader('messagekey-requestuuid')
        response.removeHeader(CONSTANTS.REQUEST_ID);
      }),
    );
  }
}
