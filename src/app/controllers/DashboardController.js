const { User } = require('../models')

class DashboardController {
  async index (req, res) {
    const { user } = req.session
    if (!user.provider) {
      const providers = await User.findAll({ where: { provider: 'true' } })
      return res.render('dashboard', { providers })
    }
    return res.render('dashboard')
  }
}

module.exports = new DashboardController()
