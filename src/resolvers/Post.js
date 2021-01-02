const Post = {
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
}

export { Post  as default }