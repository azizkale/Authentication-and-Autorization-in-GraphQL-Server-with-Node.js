const typeDefs = `
 type Query {
    users: [User!]!
    login(username:String!, password:String!): String   
 }

 type Mutation{
    addUser(id:ID!, username:String!, city:String! ): [User]
  }

 type User{
    id: ID!
    username: String!
    password: ID!
    role: String!
    city: String!
} 
`;

module.exports = typeDefs;
