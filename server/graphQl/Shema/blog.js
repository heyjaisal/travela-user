const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar JSON

  type Blog {
    id: ID!
    title: String!
    thumbnail: String!
    date: String!
    content: JSON!
    location: String
    author: User!
    likes: [User!]!
  }

  type User {
    id: ID!
    username: String!
    image: String
  }

  type Query {
    blogs(limit: Int, skip: Int, sortBy: String): [Blog!]!
    blog(id: ID!): Blog!
  }
`;
