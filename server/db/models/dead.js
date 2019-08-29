const db = require('../db')
const Sequelize = require('sequelize')

const Dead = db.define('dead', {
    dead: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
})

module.exports = Dead