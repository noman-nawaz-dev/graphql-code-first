import { createParameterDecorator } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";

export function rootSelectedFields(): ParameterDecorator {
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
