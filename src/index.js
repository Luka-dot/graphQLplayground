import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

// Spread operators plug in:  https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context: {      
        db,         // passing DB object to every single resolver regardles of file structure (ctx argument on every resolver)
        pubsub
    }
})

server.start(() => {
    console.log('Server is running!!!')
})

