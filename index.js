const express = require('express')
const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000;


// cookie parser - what this and why this we need this ?
const cookieParser = require("cookie-parser")
app.use(cookieParser())

app.use(express.json())

require('./config/database')
.dbConnect()

// routes mount and import

const user = require('./routes/user')
app.use('/api/v1',user)

// activate
// listen on the port
app.listen(PORT,()=>{
    console.log(`Server started sucessfully at ${PORT}`);
  })
