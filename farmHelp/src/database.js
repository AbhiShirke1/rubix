const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);
mongoose.connect(DB, 
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(()=>{
    console.log('database is connected successfully');
}).catch((e)=>{
    console.log(e);
})
// const conn = mongoose.connection;

// conn.on('connected', ()=> {
//     console.log('database is connected successfully');
// });

// conn.on('disconnected', ()=>{
//     console.log('database is disconnected successfully');
// })

// conn.on('error', console.error.bind(console, 'connection error:'));

// module.exports = conn;