const Subscription = {
    count: {
        subscribe(parent, arg, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++                           // increasing count
                pubsub.publish('count', {         // publishing changes
                    count: count
                })          
            }, 1000)

            return pubsub.asyncIterator('count')   // channel name
        }
    },
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find((post) => post.id === postId && post.published)
        
            if (!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, arg, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    }
}

export { Subscription as default }