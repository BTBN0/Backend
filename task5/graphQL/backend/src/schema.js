const { buildSchema } = require("graphql");

module.exports = buildSchema(
    `
    type User {
        id: Int
        name: String
        email: String
    }
    type Query {
        users: [User]
        user(id: Int):User
    }
    type Mutation {
        createUser(name: String! , email: String!): User
        updateUser(id: Int! , name: String , email: String): User
        deleteUser(id: Int!): User
    }
    `,
)