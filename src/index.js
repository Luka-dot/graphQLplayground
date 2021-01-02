import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

// Spread operators plug in:  https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread

 

// Resolvers
const resolvers = {
    Query: {
        posts(parent,args, { db }, info) {  // destructuring DB of ctx     (parent,args, ctx, info)
            if (!args.query) {
                return db.posts
            }

            return db.posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        comments(parent, args, { db }, info) {
            if (!args.query) {
            return db.comments
            }

            
        },
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users
            }

            return db.users.filter((user) => {
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
        createUser(parent,arg, { db }, info) {
            const emailTaken = db.users.some((user) => {
                return user.email === arg.data.email
            })

            if (emailTaken) {
                throw new Error('This email has been already taken.')
            }

            const user = {
                id: uuidv4(),
                ...arg.data
            }
            // const user = {
            //     id: uuidv4(),
            //     name: arg.name,
            //     email: arg.email,
            //     age: arg.age
            // }

            db.users.push(user)

            return user
        },
        deleteUser(parent, arg, { db }, info) {
            const userIndex = db.users.findIndex((user) => {
                return user.id === arg.id
            })

            if (userIndex === -1) {
                throw new Error('User not found!')
            }

            const deletedUsers = db.users.splice(userIndex, 1)  // so this deletedUser can be returned. Mutation expects return User!

            db.posts = db.posts.filter((post) => {
                const match = post.author === arg.id

                if (match) {
                    db.comments = db.comments.filter((comment) => {
                        return comment.post !== post.id
                    })
                }

                return !match
            })

            db.comments = db.comments.filter((comment) => comment.author !== arg.id)

            return deletedUsers[0]

        },
        createPost(parent, arg, { db }, info) {
            const verifyAuthor = db.users.some((user) => { 
                return user.id === arg.data.author
            }) 

            if (!verifyAuthor) {
                throw new Error('User not found.')
            }

            const post = {
                id: uuidv4(),
                ...arg.data
            }

            // const post = {
            //     id: uuidv4(),
            //     title: arg.title,
            //     body: arg.body,
            //     published: arg.published,
            //     author: arg.author
            // }

            db.posts.push(post)

            return post
        },
        deletePost(parent, arg, { db }, info) {
            const existingPostIndex = db.posts.findIndex((post) => {
                return post.id === arg.id
            })

            if (existingPostIndex === -1) {
                throw new Error('Post not found.')
            }

            const postToRemove = db.posts.splice(existingPostIndex, 1)

            db.comments = db.comments.filter((comment) => comment.post !== arg.id)

            return postToRemove[0]
        },
        createComment(parent, arg, { db }, info) {
            const verifyAuthor = db.users.some((user) => { 
                return user.id === arg.data.author
            }) 

            const verifyPost = db.posts.some((post) => {
                return (post.published === true && post.id) === arg.data.post
            })

            if (!verifyAuthor) {
                throw new Error('Pleace check author id.')
            } else if (!verifyPost) {
                throw new Error('post is not published or does not exist.')
            }

            const comment = {
                id: uuidv4(),
                ...arg.data
            }
            // const comment = {
            //     id: uuidv4(),
            //     text: arg.text,
            //     author: arg.author,
            //     post: arg.post
            // }

            db.comments.push(comment)

            return comment
        },
        deleteComment(parent, arg, { db }, info) {
            const commentIndex = db.comments.findIndex((comment) => comment.id === arg.id)

            if (!commentIndex === -1) {
                throw new Error('comment not found.')
            }

            const deletedComment = db.comments.splice(commentIndex, 1)

            comments.filter((comment) => comment.id === arg.id)

            return deletedComment[0]
        }
    },
    Post: {
        author(parent, arg, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, arg, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, arg, { db }, infor) {
            return db.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, arg, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, arg, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, arg, { db }, info) {
            return db.posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: resolvers,
    context: {      
        db,         // passing DB object to every single resolver regardles of file structure (ctx argument on every resolver)

    }
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
