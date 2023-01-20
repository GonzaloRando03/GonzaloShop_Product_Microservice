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
    length: Float
    conectors: [String]
    batery: String
    pantalla: String
    resolucion: String
    OS: String
    RAM: Int
    size: [String]
    material: String
    filtro: String
    alimentacion: String
    capacidad: Int
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
        category: String
        order: String
        price: [Float]
    ): [Result]!
    getProductOne(
        ident: String!
    ): Result
  }
  type Mutation {
    addValoration(
      ident: String!
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