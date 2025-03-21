import {
  MiddlewareFn,
  MiddlewareInterface,
  NextFn,
  ResolverData,
  ArgumentValidationError,
} from "type-graphql";
import { Context } from "../interfaces/context.interface";
import Container, { Service } from "typedi";
import { LoggerService } from "../../services/LoggerService";
import { GraphQLError } from "graphql";
import { format } from "date-fns";
import { validate } from "class-validator";

export const ResolveTime: MiddlewareFn<Context> = async (
  { context, info },
  next
) => {
  const start = Date.now();
  const result = await next();
  const resolveTime = Date.now() - start;
  const logger = Container.get(LoggerService);
  const username: string = context.userId || "guest";
  logger.debug(`Resolver execution time`, {
    resolver: `${info.parentType.name}.${info.fieldName}`,
    timeMs: resolveTime,
    user: username,
    execution: {
      start: format(start, "yyyy-MM-dd HH:mm:ss"),
      end: format(Date.now(), "yyyy-MM-dd HH:mm:ss"),
    },
  });
  return result;
};

@Service()
export class LogAccess implements MiddlewareInterface<Context> {
  constructor(private readonly logger: LoggerService) {}
  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    const username: string = context.userId || "guest";
    // const requestId = context.requestId || "unknown";
    this.logger.info(`GraphQL resolver access`, {
      user: username,
      resolver: `${info.parentType.name}.${info.fieldName}`,
      timestamp: new Date().toISOString(),
      operation: info.operation.operation,
    });
    const start = Date.now();
    try {
      const result = await next();
      // Log success
      this.logger.debug(`GraphQL resolver completed`, {
        user: username,
        resolver: `${info.parentType.name}.${info.fieldName}`,
        duration: Date.now() - start,
        success: true,
      });
      return result;
    } catch (error) {
      // Only log if not already handled by ErrorInterceptor
      if (!(error instanceof GraphQLError) || !error.extensions?.handled) {
        this.logger.error(`GraphQL resolver error`, error, {
          user: username,
          resolver: `${info.parentType.name}.${info.fieldName}`,
          duration: Date.now() - start,
          success: false,
        });
      }
      throw error;
    }
  }
}

@Service()
export class ErrorInterceptor implements MiddlewareInterface<Context> {
  constructor(private readonly logger: LoggerService) {}

  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    try {
      return await next();
    } catch (error) {
      // Get username for logging
      const username: string = context.userId || "guest";

      // Create error metadata object for detailed logging
      const errorMetadata = {
        resolver: `${info.parentType.name}.${info.fieldName}`,
        path: info.path?.typename,
        user: username,
        operation: info.operation.operation,
        // Add a flag to prevent duplicate logging
        handled: true,
      };

      // Handle different error types
      if (error instanceof ArgumentValidationError) {
        // Extract validation messages
        const validationErrors = error.message;
        // Log validation errors with details
        this.logger.warn(`GraphQL validation error`, {
          ...errorMetadata,
          validationErrors,
        });

        // Transform to GraphQL error with validation details
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "BAD_USER_INPUT",
            handled: true,
            validationErrors: validationErrors,
          },
        });
      } else if (error instanceof GraphQLError) {
        // Only log if not already handled
        if (!error.extensions?.handled) {
          this.logger.error(`GraphQL error`, error, {
            ...errorMetadata,
            code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
          });
        }

        // Re-throw the error with handled flag
        const extensions = {
          ...error.extensions,
          handled: true,
        };

        throw new GraphQLError(error.message, {
          ...error,
          extensions,
        });
      } else {
        // Log unexpected errors
        this.logger.error(`Unexpected resolver error`, error, {
          ...errorMetadata,
        });

        // Transform to a standard GraphQL error
        throw new GraphQLError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
          {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              handled: true,
              // Don't expose internal error details in production
              ...(process.env.NODE_ENV !== "production" && {
                exception: {
                  message:
                    error instanceof Error ? error.message : String(error),
                },
              }),
            },
          }
        );
      }
    }
  }
}
