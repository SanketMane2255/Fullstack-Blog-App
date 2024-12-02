const express = require('express')
const dotenv = require('dotenv')
const connect = require('./config/db')
const userRoute = require('./routes/user')
const blogroute = require('./routes/blog')
const adminRoute = require('./routes/admin')
const cors = require('cors')
const app = express()

dotenv.config()
const port = process.env.port

connect()
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // Allow cookies and headers
}))

app.use(express.json())
app.use('/api/user',userRoute)
app.use('/api/blog',blogroute)
app.use('/api/admin',adminRoute)

app.listen(port, ()=>{
    console.log(`We are listening at ${port}`)
})