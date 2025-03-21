import { createMethodMiddlewareDecorator } from "type-graphql";
import { validate } from "class-validator";
import { ArgumentValidationError } from "type-graphql";

export function ValidateArgs() {
  return createMethodMiddlewareDecorator(async ({ args }, next) => {
    // Extract arguments and validate using class-validator
    for (const argKey in args) {
      const argValue = args[argKey];

      // Validate the argument if it is an object (class-validator works on class instances)
      if (typeof argValue === "object" && argValue !== null) {
        const errors = await validate(argValue);
        if (errors.length > 0) {
          throw new ArgumentValidationError(errors);
        }
      }
    }
    return next();
  });
}
