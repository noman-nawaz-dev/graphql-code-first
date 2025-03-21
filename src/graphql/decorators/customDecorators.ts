import { createParameterDecorator } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import { createMethodMiddlewareDecorator } from "type-graphql";
import { validate } from "class-validator";
import { ArgumentValidationError } from "type-graphql";

export function RootSelectedFields(): ParameterDecorator {
  return createParameterDecorator(({ info }: { info: GraphQLResolveInfo }) => {
    const rootFields: Record<string, 1> = {};

    // Extract top-level fields from the GraphQL query info
    const fieldNodes = info.fieldNodes?.[0]?.selectionSet?.selections ?? [];

    for (const field of fieldNodes) {
      if (field.kind === "Field") {
        rootFields[field.name.value] = 1; // Include only root-level fields
      }
    }

    return rootFields;
  }) as ParameterDecorator;
}

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
