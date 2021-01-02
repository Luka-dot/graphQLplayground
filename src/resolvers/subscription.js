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
    }
}

export { Subscription as default }