const express = require('express')
const actorRouter = require('./src/routes/actor')
const movieRouter = require('./src/routes/movie')
const reviewRouter = require('./src/routes/review')
const userRouter = require('./src/routes/user')

const app = express()

require('./db/db_connect')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(actorRouter)
app.use(movieRouter)
app.use(reviewRouter)
app.use(userRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})