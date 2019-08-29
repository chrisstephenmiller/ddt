const db = require('../db')
const Sequelize = require('sequelize')

const Ball = db.define('ball', {
    color: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Ball