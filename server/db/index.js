const db = require('./db')
const { Game, Ball, Dead } = require('./models')

Ball.belongsTo(Game)
Ball.belongsToMany(Ball, { through: Dead, as: 'deadBalls' })

module.exports = db