const { gql } = require('apollo-server')

const typeDefs = gql`
  union ProductRes = Error | Product 
  union UserRes = Error | User 
  union CantidadRes = Error | Cantidad
  union MsgRes = Error | Message
  union CompraRes = Error | Compra

  type Error {
    error: String!
  }

  type Message {
    msg: String!
  }

  type User {
    id: ID
    name: String!
    lastname: String
    username: String!
    email: String!
    password: String!
    bank_account: String!
    wallet: Monedero
    token: String
  }

  type Monedero {
    id: ID
    cantidad: Float!
    limite: Int
    descuento: Int
    usuario_id: Int!
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

  type Articulo {
    precio: Float!
    nombre: String!
    cantidad: Int
    compra: Int
    id: Int
    created_at: String
    updated_at: String
  }

  input ArticuloInput {
    precio: Float!
    nombre: String!
    cantidad: Int
  }

  type Compra {
    id: Int
    idUsuario: Int!
    precioTotal: Float!
    fechaPedido: String
    fechaEntrega: String
    articulos: [Articulo]!
    descuento: Boolean
  }

  type Cantidad {
    cantidad: Float
  }

  type Query {
    getProducts(
        search: String
        amount: Int
        sale: Boolean
        category: String
        order: String
        price: [Float]
    ): [ProductRes]!

    getProductOne(
        ident: String!
    ): ProductRes
  }

  type Mutation {
    createUser(
      name: String!
      lastname: String
      username: String!
      email: String!
      password: String!
      bank_account: String!
    ): UserRes

    addMoney(
      money: Int!
      username: String!
    ): CantidadRes

    delUser(
      token: String!
    ): MsgRes

    loginUser(
      username: String!
      password: String!
    ): UserRes

    sendBuy(
      token: String!
      idUsuario: Int!
      precioTotal: Float!
      fechaPedido: String!
      fechaEntrega: String!
      articulos: [ArticuloInput]!
    ): CompraRes

    addValoration(
      ident: String!
      username: String!
      text: String
      stars: Int!
    ): ProductRes
  }

  type Subscription {
    productChanged: Product!
  }
`

module.exports = typeDefs