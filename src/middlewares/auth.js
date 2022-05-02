const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        //const token = req.cookies.authToken
        const token = req.header('Authorization')?.replace('Bearer ', '') // while testing in jest
        console.log("cookie...  ", token)
        if (token) {
            await jwt.verify(token, 'mysecretkey', async (err, data) => {
                if (!err) {
                    console.log("data-->", data)
                    req.token = token
                    const user = await User.findOne({ userId: data._id, 'tokens.token': token })
                    if (user)
                        req.user = user
                    else
                        throw new Error()

                } else {
                    console.log("### ", err.message)
                    if (err.name === 'TokenExpiredError') {
                        const payload = jwt.verify(token, 'mysecretkey', { ignoreExpiration: true });
                        console.log("payload ", payload)
                        //as token is expired logout won't work, so we are just clearing useless expired token
                        const user = await User.findOne({ userId: payload._id, 'tokens.token': token })
                        if (user) {
                            user.tokens = user.tokens.filter((obj) => obj.token !== token)
                            await user.save()
                        }
                    }

                    //res.status(405).send({ status: 405, msg: err + " Token Expired, login again" })
                    throw new Error(err.message + " Token Expired, login again")
                }
            })
            next()
        }
        else
            //res.status(405).json({ status: 405, msg: "Invalid request, not Authenticated!" })
            throw new Error("Invalid request")
    } catch (e) {
        res.status(401).send({ msg: e.message + ' Not Authenticated' })
    }
}

