const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment, User } = require('../models')

class ScheduleController {
  async index (req, res) {
    const date = moment(parseInt(req.query.date))
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      },
      include: {
        model: User,
        as: 'userId'
      }
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00'
    ]

    const scheduled = schedule.map(time => {
      let user
      const [hour, minute] = time.split(':')
      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)
      const appointmentIdx = appointments.findIndex(
        a => moment(a.date).format('HH:mm') === time
      )

      if (appointmentIdx >= 0) {
        user = appointments[appointmentIdx].userId
      }

      return {
        time,
        user
      }
    })

    return res.render('schedule/index', { scheduled })
  }
}

module.exports = new ScheduleController()
