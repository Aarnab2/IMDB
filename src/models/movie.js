const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    actors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},
    { timestamps: true }
)

module.exports = mongoose.model('Movie', MovieSchema)