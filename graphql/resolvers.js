const { PubSub } = require("graphql-subscriptions")
const queries = require("./queries")
const pubsub = new PubSub()

const resolvers = {
    //para devolver el tipo Result
    ProductRes: {
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

    UserRes: {
      __resolveType: (object) => {
        if (object.username) {
            return "User";
        }

        if (object.error) {
            return "Error";
        }

        return null;
      }
    },

    CantidadRes: {
      __resolveType: (object) => {
        if (object.cantidad) {
            return "Cantidad";
        }

        if (object.error) {
            return "Error";
        }

        return null;
      }
    },

    MsgRes: {
      __resolveType: (object) => {
        if (object.msg) {
            return "Message";
        }

        if (object.error) {
            return "Error";
        }

        return null;
      }
    },

    CompraRes: {
      __resolveType: (object) => {
        if (object.idUsuario) {
            return "Compra";
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
      createUser: queries.createUser,
      addMoney: queries.addMoney,
      delUser: queries.delUser,
      addValoration: queries.addValoration,
      loginUser: queries.loginUser,
      sendBuy: queries.sendBuy
    },
    Subscription: {
      productChanged: {
        subscribe: () => pubsub.asyncIterator(['PRODUCT_CHANGED'])
      },
    }
  }

module.exports = resolvers