import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Spread operators plug in:  https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread

// temp user data before database set up
let users = [{
    id: '1',
    name: "Lukas",
    email: "lukas@gma.com",
    age: '39'
},
{
    id: '2',
    name: "Sara",
    email: "Sara@gma.com",
    age: '29'
},
{
    id: '3',
    name: "Mikey",
    email: "mouse@gma.com"
}]

let posts = [{
    id: '11',
    title: "post one",
    body: "lukas@gma.com",
    published: true,
    author: '1'
},
{
    id: '12',
    title: "post TWO",
    body: "random text",
    published: true,
    author: '1'
},
{
    id: '13',
    title: "post THREE",
    body: "More and more of random text",
    published: false,
    author: '2'
}];

let comments = [{
    id: '31',
    text: 'This is first comment',
    author: '1',
    post: '13'
},
{
    id: '32',
    text: "this is another new comment",
    author: '1',
    post: '11'
},
{
    id:  '33',
    text: 'Im running out of ideas for comments',
    author:' 3',
    post:'11'
},
{
    id: '34',
    text: 'Finally this is a last one I have to come up ith )',
    author: '3',
    post: '13'
}
]

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

            users.push(user)

            return user
        },
        deleteUser(parent, arg, ctx, info) {
            const userIndex = users.findIndex((user) => {
                return user.id === arg.id
            })

            if (userIndex === -1) {
                throw new Error('User not found!')
            }

            const deletedUsers = users.splice(userIndex, 1)  // so this deletedUser can be returned. Mutation expects return User!

            posts = posts.filter((post) => {
                const match = post.author === arg.id

                if (match) {
                    comments = comments.filter((comment) => {
                        return comment.post !== post.id
                    })
                }

                return !match
            })

            comments = comments.filter((comment) => comment.author !== arg.id)

            return deletedUsers[0]

        },
        createPost(parent, arg, ctx, info) {
            const verifyAuthor = users.some((user) => { 
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

            posts.push(post)

            return post
        },
        deletePost(parent, arg, ctx, info) {
            const existingPostIndex = posts.findIndex((post) => {
                return post.id === arg.id
            })

            if (existingPostIndex === -1) {
                throw new Error('Post not found.')
            }

            const postToRemove = posts.splice(existingPostIndex, 1)

            comments = comments.filter((comment) => comment.post !== arg.id)

            return postToRemove[0]
        },
        createComment(parent, arg, ctx, info) {
            const verifyAuthor = users.some((user) => { 
                return user.id === arg.data.author
            }) 

            const verifyPost = posts.some((post) => {
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

            comments.push(comment)

            return comment
        },
        deleteComment(parent, arg, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === arg.id)

            if (!commentIndex === -1) {
                throw new Error('comment not found.')
            }

            const deletedComment = comments.splice(commentIndex, 1)

            comments.filter((comment) => comment.id === arg.id)

            return deletedComment[0]
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
    typeDefs: './src/schema.graphql',
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
