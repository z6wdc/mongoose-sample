const http = require('http');
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'})

mongoose
.connect(process.env.DB)
.then(()=>console.log('You successfully connected to MongoDB!'))
.catch((error)=>console.log(error));

const requestListener = async(req,res) => {
    res.end();
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
