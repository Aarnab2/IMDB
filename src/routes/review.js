const express = require("express");
const router = new express.Router();

const Movie = require('../models/movie')
const Review = require('../models/review')
const auth = require('../middlewares/auth')

router.post('/api/review', auth, async (req, res) => {
    try {
        const { comment, rating, movie: movieId } = req.body

        const review = await Review.create({ comment, rating, movie: movieId })

        const movieRec = await Movie.findByIdAndUpdate(movieId, { $addToSet: { reviews: review.id } })

        res.status(200).send({ msg: 'Review added succesfully', data: review })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.patch('/api/review', auth, async (req, res) => {
    try {
        let updates = Object.keys(req.body)
        let allowedUpdates = ['comment', 'rating']
        let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate)
            res.status(400).send({ msg: 'invalid updates!' })

        const { comment, rating } = req.body
        const review = await Review.findByIdAndUpdate(req.query.reviewId, { $set: { comment, rating } }, { new: true })

        res.status(200).send({ msg: 'Review updated succesfully', data: review })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.get('/api/review', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.query.reviewId).populate('movie')
        console.log('review ', review)
        res.status(200).send({ msg: 'Review details fetched succesfully', data: review })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

router.delete('/api/review', auth, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.query.reviewId)
        console.log('review ', review)
        await Movie.findByIdAndUpdate(review.movie, { $pull: { reviews: review.id } })
        res.status(200).send({ msg: 'Review details fetched succesfully', data: review })
    } catch (e) {
        console.log(e.message)
        res.status(400).send({ msg: e.message })
    }
})

module.exports = router