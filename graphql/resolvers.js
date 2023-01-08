const { PubSub } = require("graphql-subscriptions")
const queries = require("./queries")
const pubsub = new PubSub()

const resolvers = {
    Query: {
      getProducts: queries.getProducts,
      getProductOne: queries.getProductOne
    },
    Mutation:{
      addValoration: queries.addValoration
    },
    Subscription: {
      productChanged: {
        subscribe: () => pubsub.asyncIterator(['PRODUCT_CHANGED'])
      },
    }
  }

module.exports = resolvers