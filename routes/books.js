const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

router.get('/', async (req, res) => {
    try {
        const istanze = await Book.find();
        res.json(istanze);

    } catch (err) {
        res.json({message:err});
        
    }

});

router.post('/', async (req, res) => {
    const istanza = await new Book({
        title: req.body.title,
        subTitle : req.body.subTitle,
        autori: req.body.autori,
    });
    try {
        const savedIstanza = await istanza.save();
        res.json(savedIstanza);
    } catch (err) {
        res.json({message: err})
    }
});


router.get('/:bookID', async (req, res) =>{
    try {
        const istanza = await Book.findById(req.params.bookID);
        res.end(JSON.stringify(istanza.contaAutori()))

    } catch (err){
        res.json({message: err});
    }

});

router.delete('/:bookID', async (req, res) =>{
    try {
        const removedIstanza = await Book.deleteOne({_id: req.params.bookID});
        res.json(removedIstanza);
    } catch (err){
        res.json({message: err});
    }

});

router.patch('/:bookID', async (req, res) =>{
    try {
        const updatedIstanza = await Book.updateOne(
            {_id: req.params.bookID},
            {$set: {
                title: req.body.title ,
                subTitle: req.body.subTitle,
                autori: req.body.autori,
                formato: req.body.formato,
            }}
            );
        res.json(updatedIstanza);
    } catch (err){
        res.json({message: err});
    }

});

module.exports = router;