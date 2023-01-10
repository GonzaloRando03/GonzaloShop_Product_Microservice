const { gql } = require('apollo-server')

const typeDefs = gql`
  union Result = Error | Product 
  type Error {
    error: String!
  }
  type Features {
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
    image: String!
    images: [String!]!
    brand: String
    type: String
    valorations: [Valoration]
    stars: Float
    sale: Boolean
  }
  type Query {
    getProducts(
        search: String
        amount: Int
        sale: Boolean
    ): [Result]!
    getProductOne(
        name: String!
    ): Result
  }
  type Mutation {
    addValoration(
      name: String!
      username: String!
      text: String
      stars: Int!
    ): Result
  }
  type Subscription {
    productChanged: Product!
  }
`

module.exports = typeDefs