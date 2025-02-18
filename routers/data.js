const express = require('express'); 
const router = express.Router();    
const {getData,getData2} = require('../controllers/data');
router.get('/',getData);
router.get('/:hesap_kodu',getData2);


module.exports=router;