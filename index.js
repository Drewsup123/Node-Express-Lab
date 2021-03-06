// import your node modules

const db = require('./data/db.js');

// add your server code starting here

const express = require('express');
const server = express();
server.use(express.json());

server.get('/api/posts',(req,res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({message : "I done messed up this request"})
        })
})
server.post('/api/posts', async (req, res) => {
    console.log('body', req.body);
    try {
        const postData = req.body;
        const postId = await db.insert(postData);
        const post = await db.findById(postId.id);
        res.status(201).json(post);
    } catch (error) {
        let message = 'error creating the post you ding-a-ling';

        if (error.errno === 19) {
            message = 'please provide both the title and the contents section';
        }

        res.status(500).json({ error: "There was an error while saving the post to the database" });
    }
});

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({message: `This doesn't exist or something dude : ${id}`});
        });
});

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({message: `This doesn't exist or something dude : ${id}`});
        });
});

server.delete('/api/posts/:id', (req, res) => {
    db.remove(req.params.id)
        .then(count => {
        res.status(200).json(count);
    })
    .catch(err => {
        res.status(500).json({ message: 'error deleting post' });
    });
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db.update(id, changes)
        .then(count => {
            if (count) {
                res.status(200).json({ message: `${count} posts updated`,ID : id });
            } else {
                res.status(404).json({ message: 'post is non-existant or something like that, I dont make the rules, wait... yes I do' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." });
        });
});

server.listen(5000,() => console.log("server is running"));
