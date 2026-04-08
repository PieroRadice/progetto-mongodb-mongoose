const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    
    try {
        const posts = await Post.find();
        res.json(posts);

    } catch (err) {
        res.json({message:err});
        
    }

});

router.post('/', async (req, res) => {
    console.log(req.body.title);
    const post = await new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedPosts = await post.save();
        res.json(savedPosts);
    } catch (err) {
        res.json({message: err})
    }
});
/*
router.post('/', (req, res) => {
    console.log(req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    post.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.json({message: err})
    })
});
*/

router.get('/:postID', async (req, res) =>{
    try {
        const post = await Post.findById(req.params.postID);
        res.json(post);
    } catch (err){
        res.json({message: err});
    }

});

router.delete('/:postID', async (req, res) =>{
    try {
        const removedPost = await Post.deleteOne({_id: req.params.postID});
        res.json(removedPost);
    } catch (err){
        res.json({message: err});
    }

});

router.patch('/:postID', async (req, res) =>{
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postID},
            {$set: {
                title: req.body.title ,
                description: req.body.description
            }}
            );
        res.json(updatedPost);
    } catch (err){
        res.json({message: err});
    }

});



module.exports = router;