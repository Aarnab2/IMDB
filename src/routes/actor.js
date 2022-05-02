const express = require("express");
const router = new express.Router();

const Actor = require('../models/actor')
const auth = require('../middlewares/auth')

router.post('/api/actor', auth, async (req, res) => {
    try {
        const { name } = req.body


        const actor = await Actor.create({ name })

        res.status(200).send({ msg: 'Actor created', data: actor })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.patch('/api/actor', auth, async (req, res) => {
    try {
        let updates = Object.keys(req.body)
        let allowedUpdates = ['name', 'movies']
        let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate)
            res.status(400).send({ msg: 'invalid updates!' })

        const { name, movies } = req.body

        const updatedActor = await Actor.findByIdAndUpdate(
            req.query.actorId,
            { $set: { name: name }, $addToSet: { movies: { $each: movies } } },
            { new: true }
        )
        console.log("updatedActor ", updatedActor)

        res.status(200).send({ msg: 'Actor updated', data: updatedActor })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }

})

router.delete('/api/actor', auth, async (req, res) => {
    try {
        const actor = await Actor.findByIdAndDelete(req.query.actorId)
        res.status(200).send({ msg: 'Actor deleted', data: actor })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

// fetch actors with same names
router.get('/api/actors', auth, async (req, res) => {
    try {
        const actors = await Actor.find({ name: req.query.name }, { _id: 0, name: 1, movies: 1 })

        // console.log('actors ', actors)
        res.status(200).send({ msg: 'Actor details fetched succesfully', data: actors })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

//fetch an actor details with movies
router.get('/api/actor', auth, async (req, res) => {
    try {
        const actor = await Actor.findById(req.query.actorId).populate({ path: 'movies', select: { _id: 0, name: 1, reviews: 1 } })

        console.log('actor ', actor)
        res.status(200).send({ msg: 'Actor details fetched succesfully', data: actor })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})


module.exports = router