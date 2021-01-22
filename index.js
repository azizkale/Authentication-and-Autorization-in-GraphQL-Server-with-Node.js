import { GraphQLServer } from "graphql-yoga";
import jwt from "jsonwebtoken";
import { rule, shield, and, or, not } from "graphql-shield";
import typeDefs from "./TypeDefs";
import resolvers from "./resolvers";

function getToken(req) {
  let decodeToken;
  try {
    decodeToken = jwt.verify(
      req.request.headers.authorization,
      "MY_TOKEN_SECRET"
    );
  } catch (e) {
    return null;
  }
  console.log(decodeToken);
  return decodeToken;
}

// Rules
const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.claims !== null;
});
const canAddUser = rule()(async (parent, args, ctx, info) => {
  return ctx.claims.role === "admin";
});
const canGetUsers = rule()(async (parent, args, ctx, info) => {
  return ctx.claims.role === "user" || ctx.claims.role === "admin";
});

// Permissions
const permissions = shield({
  Query: {
    users: and(isAuthenticated, canGetUsers),
  },
  Mutation: {
    addUser: and(isAuthenticated, canAddUser),
  },
});

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [permissions],
  context: (req) => ({
    claims: getToken(req),
  }),
});

server.start({ port: 4001 }, () =>
  console.log("Server is running on http://localhost:4001")
);
