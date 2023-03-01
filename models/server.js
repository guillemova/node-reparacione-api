
const express = require("express")

const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const hpp = require("hpp")
const rateLimit = require("express-rate-limit")
const xss = require('xss-clean')

const globalErrorHandler = require("../controllers/error/error.controller")
const AppError = require("../utils/appError")

const { userRouter } = require("../routes/user.routes")
const { repairsRouter } = require("../routes/repairs.routes")
const { db } = require("../database/db")
const { authRouter } = require("../routes/auth/auth.routes")
const initModel = require("./init.model")


class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT || 4000

      
        this.limiter = rateLimit({
            max: 100,
            windowMs: 60 * 60 * 1000,
            message: 'Too many request from this IP, Place try again in an hour!.'
        })

       
        this.paths = {
            users: '/api/v1/users',
            repairs: '/api/v1/repairs',
            auth: '/api/v1/auth'
        }


        this.database()

        
        this.middlewares()

        this.routes()
    }

    middlewares() {
        this.app.use(helmet())

        this.app.use(xss())

        this.app.use(hpp())

        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'))
        }

        this.app.use('/api/v1', this.limiter)

        this.app.use(cors())
        this.app.use(express.json())
    }


    routes() {
        this.app.use(this.paths.users, userRouter)
        this.app.use(this.paths.repairs, repairsRouter)
        this.app.use(this.paths.auth, authRouter)

        this.app.all('*', (req, res, next) => {
            return next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
        })

        this.app.use(globalErrorHandler)
    }


    database() {
        db.authenticate()
            .then(() => console.log('Database authenticated'))
            .catch(error => console.log(error));

        initModel()

        db.sync()
            .then(() => console.log('Database synced'))
            .catch(error => console.log("aqui el error de sync => 🧨", error));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('server is running on port', this.port);
        })
    }
}


module.exports = Server