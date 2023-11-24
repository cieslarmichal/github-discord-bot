/* eslint-disable @typescript-eslint/no-explicit-any */

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastify, type FastifyInstance } from 'fastify';
import { type FastifySchemaValidationError } from 'fastify/types/schema.js';

import { InputNotValidError } from '../../common/errors/inputNotValidError.js';
import { type HttpController } from '../../common/types/http/httpController.js';
import { HttpStatusCode } from '../../common/types/http/httpStatusCode.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type IssueHttpController } from '../../modules/issueModule/api/httpControllers/issueHttpController/issueHttpController.js';
import { issueSymbols } from '../../modules/issueModule/symbols.js';
import { HttpRouter } from '../httpRouter/httpRouter.js';
import { coreSymbols } from '../symbols.js';

export interface StartPayload {
  readonly host: string;
  readonly port: number;
}

export class HttpServer {
  public readonly fastifyInstance: FastifyInstance;
  private readonly httpRouter: HttpRouter;
  private readonly container: DependencyInjectionContainer;
  private readonly loggerService: LoggerService;

  public constructor(container: DependencyInjectionContainer) {
    this.container = container;

    this.loggerService = this.container.get<LoggerService>(coreSymbols.loggerService);

    this.fastifyInstance = fastify({ bodyLimit: 10 * 1024 * 1024 }).withTypeProvider<TypeBoxTypeProvider>();

    this.httpRouter = new HttpRouter(this.fastifyInstance, container);
  }

  private getControllers(): HttpController[] {
    return [this.container.get<IssueHttpController>(issueSymbols.issueHttpController)];
  }

  public async start(payload: StartPayload): Promise<void> {
    const { host, port } = payload;

    this.setupErrorHandler();

    this.fastifyInstance.setSerializerCompiler(() => {
      return (data) => JSON.stringify(data);
    });

    this.httpRouter.registerControllers({
      controllers: this.getControllers(),
    });

    await this.fastifyInstance.listen({
      port,
      host,
    });

    this.loggerService.info({
      message: `HTTP Server started.`,
      context: {
        source: HttpServer.name,
        port,
        host,
      },
    });
  }

  private setupErrorHandler(): void {
    this.fastifyInstance.setSchemaErrorFormatter((errors, dataVar) => {
      const { instancePath, message } = errors[0] as FastifySchemaValidationError;

      return new InputNotValidError({
        reason: `${dataVar}${instancePath} ${message}`,
        value: undefined,
      });
    });

    this.fastifyInstance.setErrorHandler((error, request, reply) => {
      const formattedError = {
        name: error.name,
        message: error.message,
      };

      if (error instanceof InputNotValidError) {
        reply.status(HttpStatusCode.badRequest).send({ error: formattedError });
      } else {
        reply.status(HttpStatusCode.internalServerError).send({ error: formattedError });
      }

      this.loggerService.error({
        message: 'Caught an error in the HTTP server.',
        context: {
          source: HttpServer.name,
          error: {
            name: error.name,
            message: error.message,
            context: (error as any)?.context,
            stack: error.stack,
            cause: error.cause,
          },
          path: request.url,
          method: request.method,
          statusCode: reply.statusCode,
        },
      });
    });
  }
}
