const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("email is not valid.")
        }
    }
    ,
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        validate(val) {
            if (val.toLowerCase().includes("password"))
                throw new Error(`password can't contain the word "password" in it.`)
        }
    }
},
    { timestamps: true }
)

//SCHEMA METHODS
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email })
    if (!user)
        return { user, msg: "invalid email" }

    const flag = bcrypt.compare(password, user.password)
    if (flag)
        return { user }
    else
        return { user: null, msg: "wrong password" }
}

//INSTANCE METHODS
UserSchema.methods.generateAuthtoken = async function () {
    const user = this
    // console.log(user)
    const token = await jwt.sign({ _id: user.userId }, 'mysecretkey', { expiresIn: "20d" })
    return token
}

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    console.log('before saving')
    next()
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel