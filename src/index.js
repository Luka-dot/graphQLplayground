import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// temp user data before database set up
const users = [{
    id: 1,
    name: "Lukas",
    email: "lukas@gma.com",
    age: 39
},
{
    id: 2,
    name: "Sara",
    email: "Sara@gma.com",
    age: 29
},
{
    id: 3,
    name: "Mikey",
    email: "mouse@gma.com"
}]

const posts = [{
    id: 11,
    title: "post one",
    body: "lukas@gma.com",
    published: true,
    author: 1
},
{
    id: 12,
    title: "post TWO",
    body: "random text",
    published: true,
    author: 1
},
{
    id: 13,
    title: "post THREE",
    body: "More and more of random text",
    published: false,
    author: 2
}];

const comments = [{
    id: 31,
    text: 'This is first comment',
    author: 1,
    post: 13
},
{
    id: 32,
    text: "this is another new comment",
    author: 1,
    post: 11
},
{
    id:  33,
    text: 'Im running out of ideas for comments',
    author: 3,
    post:11
},
{
    id: 34,
    text: 'Finally this is a last one I have to come up ith )',
    author: 3,
    post: 13
}
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me:  User!
        post: Post!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    } 

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
// Resolvers
const resolvers = {
    Query: {
        posts(parent,args, ctx, info) {
            if (!args.query) {
                return posts
            }

            // return posts.filter((post) => {
            //     return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            // })
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
            return comments
            }

            
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: '123345678',
                name: 'Mike',
                email: 'mike@gmail.com',
                age: 28
            }
        },

        post() {
            return {
                id: '1233098',
                title: 'First post',
                body: 'This is a post to my new grapQL API',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent,arg, ctx, info) {
            const emailTaken = users.some((user) => {
                return user.email === arg.email
            })

            if (emailTaken) {
                throw new Error('This email has been already taken.')
            }

            const user = {
                id: uuidv4(),
                name: arg.name,
                email: arg.email,
                age: arg.age
            }

            users.push(user)

            return user
        }
    },
    Post: {
        author(parent, arg, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, arg, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, arg, ctx, infor) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, arg, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, arg, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, arg, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
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

// // Type definitions (schema)
// const typeDefs = `
//     type Query {
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float                 
//     }
    
//     type User {
//         id: ID!
//         name: String!
//         email: String!
//         age: Int
//     } 
// `
// // Resolvers
// const resolvers = {
//     Query: {
//         id() {
//             return 'ZXT234'
//         },
//         name() {
//             return 'Lukas'
//         },
//         age() {
//             return 27
//         },
//         employed() {
//             return true
//         },
//         gpa() {
//             return 3.77  // can return null since we did not define type with !
//         }
//     }
// }

// const server = new GraphQLServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers
// })

// server.start(() => {
//     console.log('Server is running!!!')
// })




// // Type definitions (schema)
// const typeDefs = `
//     type Query {
//         greeting(name: String, position: String): String!
//         add(numberOne: Float!, numberTwo: Float!): Float
//         addGrades(numbers: [Float!]!): Float!
//         grades: [Int!]!
//         me:  User!
//         post: Post!
//     }
    
//     type User {
//         id: ID!
//         name: String!
//         email: String!
//         age: Int
//     }
    
//     type Post {
//         id: ID!
//         title: String!
//         body: String!
//         published: Boolean!
//     } 
// `
// // Resolvers
// const resolvers = {
//     Query: {
//         add(parent, args, ctx, info) {
//             return args.numberOne + args.numberTwo
//         },
//         addGrades(parent, args, ctx, info) {
//             if (args.numbers.length === 0) {
//                 return 0
//             } else {
//                 return args.numbers.reduce((accumulator, currentValue) => {
//                     return accumulator + currentValue
//                 })
//             }
//         },
//         greeting(parent, args, ctx, info) {
//             if (!args.name) {
//                 return 'Hello user.'
//             } else {
//             return `Hello ${args.name}, you are my favorite ${args.position}`
//             }
//         },
//         grades(parent, args, ctx, info) {
//             return [98, 55, 79]
//         },
//         me() {
//             return {
//                 id: '123345678',
//                 name: 'Mike',
//                 email: 'mike@gmail.com',
//                 age: 28
//             }
//         },

//         post() {
//             return {
//                 id: '1233098',
//                 title: 'First post',
//                 body: 'This is a post to my new grapQL API',
//                 published: true
//             }
//         }
//     }
// }

// const server = new GraphQLServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers
// })
