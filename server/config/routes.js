const authRoutes = require('../routes/auth')
const carRoutes = require('../routes/car')
const statsRoutes = require('../routes/stats')
const ordersRoutes = require('../routes/order')

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/car', carRoutes)
  app.use('/stats', statsRoutes)
  app.use('/orders', ordersRoutes)
}
