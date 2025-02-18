const pool = require('../database/db');

const getData=async(req,res)=>{
  const data =
   await pool.query('select left(hesap_kodu,3) as hesap_kodu,sum(borc) as borc from account_info where length(hesap_kodu)=6 group by left(hesap_kodu,3)');
  console.log(data)
  res.status(200)
  .json({
    "success": true,
    "data": data.rows
  }
  );
}

const getData2=async(req,res)=>{
  const hesap_kodu=req.params.hesap_kodu;
  const valueLength=String(String(hesap_kodu).length);
  const valueLength2=valueLength==3?String(parseInt(valueLength)+3):String(parseInt(valueLength)+5);  
  const data =
   await pool.query(`
      SELECT LEFT(hesap_kodu, $1) AS hesap_kodu, SUM(borc) AS borc 
      FROM account_info 
      WHERE (LEFT(hesap_kodu, $2) = $3 AND LENGTH(hesap_kodu) = $4) 
      GROUP BY LEFT(hesap_kodu, $1) 
      ORDER BY LEFT(hesap_kodu, $1)
  `, [valueLength2, valueLength, hesap_kodu, valueLength2]);

  res.status(200)
  .json({
    "success": true,
    "data": data.rows
  }
  );
}



module.exports={
    getData,
    getData2
};
