const { gql } = require('apollo-server')

const typeDefs = gql`
  type Features{
    colors: [String]
    height: Float
    width: Float
    conectors: [String]
    batery: String
    screen: String
  }
  type Valoration {
    username: String!
    text: String
    stars: Float!
  }
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
    description: String!
    features: Features
    images: [String!]!
    brand: String
    type: String
    valorations: [Valoration]
    stars: Float
  }
  type Query {
    getProducts(
        search: String
        amount: Int
    ): [Product!]!
    getProductOne(
        name: String!
    ): Product
  }
  type Mutation {
    addValoration(
      name: String!
      username: String!
      text: String
      stars: Int!
    ): Product
  }
  type Subscription {
    productChanged: Product!
  }
`

module.exports = typeDefs