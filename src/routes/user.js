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

        res.status(200).send({ msg: 'Logged in', data: userData.user, token })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.post('/api/logout', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter((obj) => obj.token !== req.token)
        await user.save()
        res.status(200).send({ msg: "Logged Out successfully.", data: user })
    } catch (e) {
        res.status(500).send({ msg: e.message, data: null });
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