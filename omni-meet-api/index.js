require('dotenv').config()
import './env'
import express from 'express'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { initClientDbConnection } from './src/db/dbConnection'
import {swaggerSpec,swaggerOptions} from './swagger_config/swagger'
import swaggerUi from 'swagger-ui-express'
import userUnSecureRoute from './src/routes/unsecure/user'
import roomUnSecureRoute from './src/routes/unsecure/room'
import meetingUnSecureRoute from './src/routes/unsecure/meeting'

// mongoose.set('useCreateIndex', true)
const app = express()
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send('Hello World! get lost');
  });

const corsOptions = {
credentials: true, origin:(origin, callback)=> {
    callback(null, true)
},
}

app.use(`${process.env.BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec,swaggerOptions))

app.use(helmet())
app.use(cors(corsOptions))
app.enable('trust proxy')
app.set('trust proxy', 1)
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Accept, Authorization, Content-Type, Access-Control-Request-Method,Access-Control-Allow-Origin, Access-Control-Allow-Headers, Accept,x-auth-token, mix-panel',
  )
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.status(200).send({ success: true })
  } else next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '10kb' }))

// app.use(authenticate)

userUnSecureRoute(app)
roomUnSecureRoute(app)
meetingUnSecureRoute(app)

const httpServer = require('http').createServer(app)
httpServer.listen(PORT, () => {
    console.log(`Node_ENV : ${process.env.NODE_ENV}`)
    console.log(`Server is running on port ${PORT}`)
  })

  /* Initializing the database connection */
global.clientConnection =  initClientDbConnection()
