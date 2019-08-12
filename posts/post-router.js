const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    const { limit, orderby } = req.query;

    const query = db.select('id', 'title', 'contents').from('posts');

    if(orderby) {
        query.orderBy(orderby);
    }


    if(limit) {
        query.limit(limit)
    }

  
    query
    .then(posts => {
        res.status(200).json({ posts })
    })
    .catch(err => {
        res.status(500).json({ message: 'error getting posts'})
    })  
});

router.get('/:id', (req, res) => {
   db('posts')
   .where({ id: req.params.id })
   .first()
   .then(post => {
       res.status(200).json(post);
   })
   .catch(err => {
      res.status(500).json({ message: 'error getting post from db' }) 
   })
});

router.post('/', (req, res) => {
    const post = req.body
    db('posts')
        .insert(post, 'id')
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'error getting post from the id' })
        })
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    db('posts')
        .where('id', '=', req.params.id)
        .update(changes)
        .then(count => {
            if(count > 0) {
                res.status(200).json(count);
            } else{
                Response.STATUS(404).JSON({ MESSAGE: 'not found' })
            }
                
        })
        .catch(err => {
        res.status(500).json({ message: 'error saving post from db' }) 
        })
});

router.delete('/:id', (req, res) => {
    db('posts')
    .where('id', '=', req.params.id)
    .del()
    .then(count => {
        if(count > 0) {
            res.status(200).json(count);
        } else{
            Response.STATUS(404).JSON({ MESSAGE: 'not found' })
        }
            
    })
    .catch(err => {
       res.status(500).json({ message: 'error saving post from db' }) 
    })
});

module.exports = router;