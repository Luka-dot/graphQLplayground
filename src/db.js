const users = [{
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

const posts = [{
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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}

export { db as default }