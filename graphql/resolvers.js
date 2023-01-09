const { PubSub } = require("graphql-subscriptions")
const queries = require("./queries")
const pubsub = new PubSub()

const resolvers = {
    //para devolver el tipo Result
    Result: {
      __resolveType: (object) => {
        if (object.name) {
            return "Product";
        }

        if (object.error) {
            return "Error";
        }

        return null;
      }
    },
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