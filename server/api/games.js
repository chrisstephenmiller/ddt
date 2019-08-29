const router = require('express').Router()
const { Game, Ball, Dead } = require('../db/models/')

router.get('/', async (req, res, next) => {
    try {
        const games = await Game.findAll()
        res.json(games)
    }
    catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
    try {
        const game = await Game.create()
        res.send(game)
    }
    catch (err) { next(err) }
})

router.get('/:gameId', async (req, res, next) => {
    try {
        const {gameId} = req.params
        const game = await Game.findByPk(gameId)
        res.send(game)
    }
    catch (err) { next(err) }
})

router.get('/:gameId/balls', async (req, res, next) => {
    try {
        const { gameId } = req.params
        const balls = await Ball.findAll({ where: { gameId }, include: 'deadBalls' })
        res.send(balls)
    }
    catch (err) { next(err) }
})

const pickColor = async balls => {
    const oldColors = balls.map(ball => ball.color)
    const ballColors = ['orange', 'green', 'black', 'red', 'yellow', 'blue']
    let newColor = ballColors.pop()
    while (newColor && oldColors.includes(newColor)) newColor = ballColors.pop()
    return newColor
}

router.post('/:gameId/balls', async (req, res, next) => {
    try {
        const { gameId } = req.params
        const { ballColors } = req.body
        for (const color of ballColors) {
            const balls = await Ball.findAll({ where: { gameId } })
            const newBall = await Ball.create({ color, gameId })
            if (newBall) {
                for (const ball of balls) {
                    await ball.addDeadBall(newBall.id, { through: { dead: false } })
                    await newBall.addDeadBall(ball.id, { through: { dead: false } })
                }
            }
        }
        // const color = await pickColor(balls)
        res.send('Balls created')
    }
    catch (err) { next(err) }
})

module.exports = router