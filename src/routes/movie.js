const express = require("express");
const router = new express.Router();

const Movie = require('../models/movie')
const Actor = require('../models/actor')
const auth = require('../middlewares/auth')

router.post('/api/movie', auth, async (req, res) => {
    try {
        const { name, actors } = req.body

        const movie = await Movie.create({ name, actors })

        // NOTE: Actors need to be created first before including them in movies
        actors.forEach(async (actorId) => {
            const actor = await Actor.findByIdAndUpdate(actorId, { $addToSet: { movies: movie.id } })
        });

        res.status(200).send({ msg: 'Movie created succesfully', data: movie })
    } catch (e) {
        console.log("HERE ", e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.patch('/api/movie', auth, async (req, res) => {
    try {
        let updates = Object.keys(req.body)
        let allowedUpdates = ['name', 'actors', 'reviews']
        let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate)
            res.status(400).send({ msg: 'invalid updates!' })

        const { name, actors, reviews } = req.body

        // NOTE: Actors and reviews need to be created first before including them in movies
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.query.movieId,
            { $set: { name: name }, $addToSet: { reviews: { $each: reviews }, actors: { $each: actors } } },
            { new: true }
        )
        console.log("updatedMovie ", updatedMovie)

        res.status(200).send({ msg: 'Movie updated', data: updatedMovie })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.delete('/api/movie', auth, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.query.movieId)
        res.status(200).send({ msg: 'Movie deleted', data: movie })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

// fetch movies with same name
router.get('/api/movies', auth, async (req, res) => {
    try {
        const { name } = req.body

        const movies = await Movie.find({ name }, { _id: 0, name: 1, movieId: 1 })

        res.status(200).send({ msg: 'Movies fetched succesfully', data: movies })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})
//fetch a movie details with actor and reviews
router.get('/api/movie', auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.query.movieId).populate({ path: 'actors', select: { _id: 0, name: 1, movies: 1 } })
            .populate({ path: 'reviews', select: { _id: 0, comment: 1, rating: 1, movie: 1 } })
        console.log('movie ', movie)
        res.status(200).send({ msg: 'Movie details fetched succesfully', data: movie })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

module.exports = router