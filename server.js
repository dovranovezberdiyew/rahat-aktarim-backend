const express=require('express');
const router=require('./routers/index');
const dotenv=require('dotenv');
const path=require('path');
const cors=require("cors")
const app=express();

dotenv.config({path:'./config/env/config.env'});
const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use(cors()); // CORS Middleware

app.use('/api',router);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Sadece React izinli
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

const https = require('https')
const pool=require('./database/db');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const agent = new https.Agent({
  rejectUnauthorized: false,
})

async function getData() {
  const username = 'apitest'
  const password = 'test123'
  const encodedCredentials = btoa(`${username}:${password}`)
  let token = await fetch(
    'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data.response.token)
    .catch((error) => console.error('Fetch Hatası:', error))
  let data = await fetch(
    'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      agent, // TLS doğrulamasını sadece bu istekte kapat
    }
  )
    .then((response) => response.json())
    .then((data) => data.response.data)
    .catch((error) => console.error('Fetch Hatası:', error))
  data = JSON.parse(data[0].fieldData.data) 
  return data
}

pool.connect()
.then(() => console.log('PostgreSQL Pool bağlantısı başarılı!'))
.catch(err => console.error('Bağlantı hatası:', err.stack));


async function getDataFromApi() {
  const data = await getData();
  for (const element of data) {  // forEach yerine for...of
    const result = await pool.query(`SELECT * FROM account_info where id=${element.id}`); 
    if (result.rows.length > 0) {
      await pool.query(`Update account_info set
         hesap_kodu='${element.hesap_kodu}',
         hesap_adi='${element.hesap_adi}',
         tipi='${element.tipi}',
         ust_hesap_id=${element.ust_hesap_id},
         borc='${isNaN(parseFloat(element.borc)) ? 0 : parseFloat(element.borc)}',
         alacak='${element.alacak}',
         borc_sistem='${element.borc_sistem}',
         alacak_sistem='${element.alacak_sistem}',
         borc_doviz='${element.borc_doviz}',
         alacak_doviz='${element.alacak_doviz}',
         borc_islem_doviz='${element.borc_islem_doviz}',
         alacak_islem_doviz='${element.alacak_islem_doviz}',
         birim_adi='${element.birim_adi}',
         bakiye_sekli='${element.bakiye_sekli}',
         aktif='${element.aktif}',
         dovizkod='${element.dovizkod}'
         where id=${element.id}`);
    } 
    else {
      await pool.query(`INSERT INTO account_info
        (id,
         hesap_kodu,
         hesap_adi,
         tipi,
         ust_hesap_id,
         borc,
         alacak,
         borc_sistem,
         alacak_sistem,
         borc_doviz,
         alacak_doviz,
         borc_islem_doviz,
         alacak_islem_doviz,
         birim_adi,
         bakiye_sekli,
         aktif,
         dovizkod
         )
         VALUES (
          ${element.id},
         '${element.hesap_kodu}',
         '${element.hesap_adi}',
         '${element.tipi}',
          ${element.ust_hesap_id},
         '${isNaN(parseFloat(element.borc)) ? 0 : parseFloat(element.borc)}',
         '${element.alacak}',
         '${element.borc_sistem}',
         '${element.alacak_sistem}',
         '${element.borc_doviz}',
         '${element.alacak_doviz}',
         '${element.borc_islem_doviz}',
         '${element.alacak_islem_doviz}',
         '${element.birim_adi}',
         '${element.bakiye_sekli}',
         '${element.aktif}',
         '${element.dovizkod}'
          )`);
      
    }
  }
  setTimeout(getDataFromApi, 5000);
}


getDataFromApi();


