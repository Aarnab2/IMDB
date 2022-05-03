const express = require("express");
const router = new express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user')
const auth = require('../middlewares/auth')

router.post('/api/user', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userId = uuidv4()

        const user = await new User({ userId, name, email, password }).save()

        res.status(200).send({ msg: 'User created', data: user })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findByCredentials(email, password) //schema method
        if (!userData.user)
            throw new Error(userData.msg)
        const token = await userData.user.generateAuthtoken() // instance method
        res.cookie('authToken', token, { httpOnly: true, maxAge: 20 * 24 * 3600 * 1000 }) //20days
        res.status(200).send({ msg: 'Logged in', data: userData.user, token })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.post('/api/logout', async (req, res) => {
    try {
        res.cookie("authToken", 'ajbsd', { httpOnly: true, maxAge: 0 });
        res.status(200).send({ msg: "Logged Out successfully." })
    } catch (e) {
        res.status(500).send({ msg: e.message });
    }
})

router.get('/api/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.query.userId })
        res.send(user)

    } catch (e) {
        console.log(e.message)
    }

})

module.exports = router