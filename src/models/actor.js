const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // actorId: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    movies:
        [{
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
        ]
},
    { timestamps: true }
)

module.exports = mongoose.model('Actor', ActorSchema)