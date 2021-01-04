import { v4 as uuidv4 } from 'uuid';

const Mutation = {
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
    updateUser(parent, arg, { db}, info) {
        const { id, data } = arg
        const userToUpdate = db.users.find((user) => user.id === id)

        if (!userToUpdate) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)

            if (emailTaken) {
                throw new Error('email in use, choose different email')
            }

            userToUpdate.email = data.email
        }

        if (typeof data.name === 'string') {
            userToUpdate.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            userToUpdate.age = data.age
        }

        return userToUpdate
    },
    createPost(parent, arg, { db, pubsub }, info) {
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
        if (post.published === true) {
            pubsub.publish('post', {
                post: {
                    mutation: 'POST CREATED',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, arg, { db, pubsub }, info) {
        const existingPostIndex = db.posts.findIndex((post) => {
            return post.id === arg.id
        })

        if (existingPostIndex === -1) {
            throw new Error('Post not found.')
        }

        const postToRemove = db.posts.splice(existingPostIndex, 1)

        db.comments = db.comments.filter((comment) => comment.post !== arg.id)

        if (postToRemove[0].published === true) {
            pubsub.publish('post', {
                post: {
                    mutation: 'POST DELETED',
                    data: postToRemove[0]
                }
            })
        }

        return postToRemove[0]
    },
    updatePost(parent, arg, { db, pubsub }, info) {
        const { id, data } = arg
        const postToUpdate = db.posts.find((post) => post.id === id)
        const originalPost = {...postToUpdate}

        if (!postToUpdate) {
            throw new Error('post not found.')
        }

        if (typeof data.title === 'string') {
            postToUpdate.title = data.title
        }

        if (typeof data.body === 'string') {
            postToUpdate.body = data.body
        }
        
        if (typeof data.published === 'boolean') {
            postToUpdate.published = data.published 

            if (originalPost.published === true && !postToUpdate.published ) {
                // delete
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && postToUpdate.published) {
                // create
                pubsub.publish('post', {
                    post: 'CREATED',
                    data: postToUpdate
                })
            }
        } else if (postToUpdate.published) {
            // update
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: postToUpdate
                }
            })
        }

        return postToUpdate
    },
    createComment(parent, arg, { db, pubsub }, info) {
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
        pubsub.publish(`comment ${arg.data.post}`, { 
            comment: {
                mutation: 'COMMENT CREATED',
                data: comment
            }
        })

        return comment
    },
    deleteComment(parent, arg, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === arg.id)

        if (!commentIndex === -1) {
            throw new Error('comment not found.')
        }

        const deletedComment = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComment[0].post}`, {
            comment: {
                mutation: 'COMMENT DELETED',
                data: deletedComment[0]
            }
        })

        return deletedComment[0]
    },
    updateComment(parent, arg, { db, pubsub }, info) {
        const { id, data } = arg
        const commentToUpdate = db.comments.find((comment) => comment.id === id )

        if (!commentToUpdate) {
            throw new Error('comment not found.')
        }

        if (typeof data.text === 'string') {
            commentToUpdate.text = data.text
        }

        pubsub.publish(`comment ${commentToUpdate.post}`, {
            comment: {
                mutation: 'UPDATED COMMENT',
                data: commentToUpdate
            }
        })

        return commentToUpdate
    }
}

export { Mutation as default }