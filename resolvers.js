import Users from "./data";
import jwt from "jsonwebtoken";
const resolvers = {
  Query: {
    users: async (parent, args) => {
      return Users;
    },
    login: async (_, { username, password }) => {
      let user = Users.find(
        (u) => u.username === username && u.password === password
      );
      const token = jwt.sign(
        { username: user.username, password: user.password, role: user.role },
        "MY_TOKEN_SECRET"
      );
      return token;
    },
  },
  Mutation: {
    addUser: async (_, { id, username, city }) => {
      const newUser = {
        id: id,
        username: username,
        city: city,
      };
      Users.push(newUser);
      return Users;
    },
  },
};
module.exports = resolvers;
