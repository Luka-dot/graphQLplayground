import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float                 
    }
`
// Resolvers
const resolvers = {
    Query: {
        id() {
            return 'abc123'
        },
        name() {
            return 'Lukas'
        },
        age() {
            return 27
        },
        employed() {
            return true
        },
        gpa() {
            return 3.77
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.start(() => {
    console.log('Server is running!!!')
})






// import { message } from './myModule';
// import { adding, substracting } from './math';

// console.log(message);

// console.log(adding(2, 2));
// substracting( 10, 5);