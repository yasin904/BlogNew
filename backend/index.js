const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const socket = require('./socket')
const feedRoutes = require('./routes/feed.route')



const app = express()
app.use(bodyParser.json())

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
const PORT_NO = 5000


app.get('/',(req,res)=>{
    console.log("Hello World")
    return res.status(200).json({
        message : "Hello World"
    })
});



app.use('/feed',feedRoutes);

mongoose
.connect("mongodb://localhost:27017/blog")
.then(()=>{
    const server = app.listen(5000,()=>{
        console.log("Server is running on port 5002")
    });


    const io = socket.init(server)
    

    io.on("connection",(socket)=>{

        console.log("client connected")

        socket.on("disconnect",(socket)=>{
            console.log("client disconnected");
        })
    }
    
    );
    
})
.catch((err)=>{
    console.log("could not connect to mongodb : ",err)
    process.exit(1);
})