// import node modules
const express = require('express')
const app = express()
require('dotenv').config()

//import custom modules
const homeRouter = require('./src/routes/homeRoutes')
const authRouter = require('./src/routes/authRoutes')
const connectMongoDB = require('./configs/database')

// Access environment variables using 'process.env'
const port = process.env.APP_PORT || 8000
const url = process.env.APP_HOST
const dataBase = process.env.DATABASE
const dataBaseUrl = process.env.DATABASE_URL

//Db Connection
connectMongoDB(`${dataBaseUrl}${dataBase}`).then(()=>{console.log('MongoDb is connected')})

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use routes
app.use('/', homeRouter)
app .use('/api', authRouter)


app.listen(port, () => {console.log(`App is running with express on server : ${url}${port}`)})