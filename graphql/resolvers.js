const { PubSub } = require("graphql-subscriptions")
const queries = require("./queries")
const pubsub = new PubSub()

const resolvers = {
    Query: {
      getProducts: queries.getProducts,
      getProductOne: queries.getProductOne
    },
    Mutation:{
      addValoration: async (root, args, context) => {
        console.log('asdf',context)
        const product = null
        pubsub.publish('PRODUCT_CHANGED', { personAdded: product })
        return product
      }
    },
    Subscription: {
      productChanged: {
        subscribe: () => pubsub.asyncIterator(['PRODUCT_CHANGED'])
      },
    }
  }

module.exports = resolvers