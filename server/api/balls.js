const router = require('express').Router()
const { Ball, Dead } = require('../db/models/')

router.put('/:ballId/', async (req, res, next) => {
    try {
        const { ballId } = req.params
        const deadBalls = await Dead.findAll({ where: { ballId } })
        for (const deadBall of deadBalls) {
            await deadBall.update({ dead: false })
            await deadBall.save()
        }
        res.send(deadBalls)
    } catch (err) { next(err) }
})

router.put('/:ballId/dead/:deadId', async (req, res, next) => {
    try {
        const { ballId, deadId } = req.params
        const deadBall = await Dead.findOne({ where: { ballId, deadBallId: deadId } })
        await deadBall.update({ dead: true })
        await deadBall.save()
        res.send(deadBall)
    } catch (err) { next(err) }
})


module.exports = router