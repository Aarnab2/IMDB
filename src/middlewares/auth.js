const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.authToken
        console.log("cookie...  ", token)
        if (token) {
            await jwt.verify(token, 'mysecretkey', async (err, data) => {
                if (!err) {
                    console.log("data-->", data)
                    req.token = token
                    const user = await User.findOne({ userId: data._id })
                    if (user)
                        req.user = user
                    else
                        throw new Error()

                } else {
                    console.log("### ", err.message)
                    throw new Error(err.message + " Token Expired, login again")
                }
            })
            next()
        }
        else
            throw new Error("Invalid request")
    } catch (e) {
        res.status(401).send({ msg: e.message + ' Not Authenticated' })
    }
}

