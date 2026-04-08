const express = require('express');
const router = express.Router();

router.get('/cavalli',(req, res)=>{
    res.send("cavalli")
})
router.get('/cavalli/sauro',(req,res)=>{
    res.send("QUesto è per i cavalli SAURI");
})
router.get('/cavalli/arabi',(req,res)=>{
    res.send("QUesto è per i cavalli ARABI");
})
router.get('/cavalli/roani',(req,res)=>{
    res.send("QUesto è per i cavalli ROANI");
})
router.get('/cavalli/bai',(req,res)=>{
    res.send("QUesto è per i cavalli BAI");
})


module.exports = router;