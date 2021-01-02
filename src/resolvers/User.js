const User = {
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
}

export { User as default }