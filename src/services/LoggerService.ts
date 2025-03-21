import { Service } from "typedi";
import * as winston from "winston";
import { createLogger, format, transports } from "winston";
import path from "path";

@Service()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDir = "logs";

    // Define log format
    const logFormat = format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.errors({ stack: true }),
      format.splat()
      // Removing json() format as we'll handle formatting in our custom formats
    );

    // Custom format for console with proper indentation
    const consoleFormat = format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;

        if (metadata && Object.keys(metadata).length > 0) {
          // Format metadata as indented JSON
          const metadataStr = JSON.stringify(metadata, null, 2);
          // Add indentation to each line after the first one
          const indentedMetadata = metadataStr.replace(/\n/g, "\n  ");
          msg += " " + indentedMetadata;
        }

        return msg;
      }
    );

    // Create logger instance
    this.logger = createLogger({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: logFormat,
      defaultMeta: { service: "graphql-api" },
      transports: [
        // Console transport with pretty formatting
        new transports.Console({
          format: format.combine(format.colorize(), consoleFormat),
        }),

        // File transport for all logs (with pretty JSON)
        new transports.File({
          filename: path.join(logDir, "combined.log"),
          maxsize: 10485760, // 10MB
          maxFiles: 5,
          format: format.combine(
            format.printf((info) => {
              const { timestamp, level, message, ...rest } = info;
              return JSON.stringify(
                {
                  timestamp,
                  level,
                  message,
                  ...rest,
                },
                null,
                2
              );
            })
          ),
        }),

        // File transport for error logs (with pretty JSON)
        new transports.File({
          filename: path.join(logDir, "error.log"),
          level: "error",
          maxsize: 10485760, // 10MB
          maxFiles: 5,
          format: format.combine(
            format.printf((info) => {
              const { timestamp, level, message, ...rest } = info;
              return JSON.stringify(
                {
                  timestamp,
                  level,
                  message,
                  ...rest,
                },
                null,
                2
              );
            })
          ),
        }),
      ],
      exitOnError: false,
    });
  }

  log(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata);
  }

  error(
    message: string,
    error?: Error | any,
    metadata?: Record<string, any>
  ): void {
    const metaWithError = {
      ...metadata,
      error:
        error instanceof Error
          ? {
              message: error.message,
              // Stack trace removed
            }
          : error,
    };
    this.logger.error(message, metaWithError);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.logger.warn(message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.logger.debug(message, metadata);
  }

  http(message: string, metadata?: Record<string, any>): void {
    this.logger.http(message, metadata);
  }
}
