import { ApolloServer, gql } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const typeDefs = gql`
  type Produce {
    name: String!
    price: Float!
    pricePer: String!
    location: String!
    available: Boolean!
  }
  type Query {
    hello: String
    produce: [Produce!]!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    produce: async () => {
      const client = await clientPromise;
      const db = client.db();
      const items = await db.collection("produce").find({}).toArray();
      return items.map((item) => ({
        name: item.name,
        price: item.price,
        pricePer: item.pricePer,
        location: item.location,
        available: !!item.available,
      }));
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}
