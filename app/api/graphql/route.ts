import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, graphql } from "graphql";
import { findOrderById } from "../../lib/data";
import { requireUserResponse } from "../../lib/session";

const OrderItemType = new GraphQLObjectType({
  name: "OrderItem",
  fields: {
    sku: { type: GraphQLString },
    name: { type: GraphQLString },
    quantity: { type: GraphQLFloat },
    unitPrice: { type: GraphQLFloat }
  }
});

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: {
    id: { type: GraphQLString },
    ownerId: { type: GraphQLString },
    status: { type: GraphQLString },
    total: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    placedAt: { type: GraphQLString },
    customerName: { type: GraphQLString },
    channel: { type: GraphQLString },
    items: { type: new GraphQLList(OrderItemType) },
    privateNote: { type: GraphQLString }
  }
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    order: {
      type: OrderType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_source, args: { id?: string }) => {
        if (!args.id) return null;

        // Intentional BOLA for BoLD testing:
        // this resolver authenticates the caller at the route layer but skips owner scoping.
        return findOrderById(args.id) || null;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});

export async function POST(request: Request) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.query !== "string") {
    return Response.json({ errors: [{ message: "Expected JSON body with a GraphQL query string" }] }, { status: 400 });
  }

  const result = await graphql({
    schema,
    source: body.query,
    variableValues: body.variables,
    contextValue: { user: auth.user }
  });

  return Response.json(result);
}
