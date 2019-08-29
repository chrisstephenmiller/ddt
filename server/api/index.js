const router = require('express').Router()

router.use('/games', require('./games'))
router.use('/balls', require('./balls'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router
