const data=require('./data');   
const express=require('express');
const router=express.Router();

router.use('/data',data);



module.exports=router;