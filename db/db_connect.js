require('dotenv').config()
const mongoose = require('mongoose')
const url = `mongodb+srv://${process.env.USER_NAME}:${encodeURIComponent(process.env.DB_PASS)}@imdb.ph3wa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

try {
    mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => {
        console.log('Connected to Database successfully.')
    })
} catch (e) {
    console.log(e.message)
}
