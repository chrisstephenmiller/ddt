const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name
const db = process.env.ENVIRONMENT === 'PROD' 
? new Sequelize(process.env.DATABASE_URL)
: new Sequelize(process.env.DATABASE_NAME || databaseName, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST || 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
})

module.exports = db