const { ApolloServer } = require('apollo-server')
const connectDatabase = require("./utils/database")
const typeDefs = require('./graphql/types')
const resolvers = require('./graphql/resolvers')

connectDatabase()

const server = new ApolloServer({
    typeDefs,
    resolvers,
})
  
server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})