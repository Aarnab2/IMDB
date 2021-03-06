const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Review', ReviewSchema)