const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')
const schedule = require('node-schedule')
const User = require('./models/user')
const Doctor = require('./models/doctor')

const PORT = process.env.PORT || 3000
const MONGO_URI = 'mongodb://localhost/AppointmentsDB'

const app = express()

app.use(bodyParser.json())

const start = async () => {
  try {
    await mongoose.connect(
      MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    )
    console.log(`MongoDB connected to ${MONGO_URI}`)
    app.listen(PORT, () => {
      console.log(`Server ready at https://localhost:${PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()

app.get('/status', (req, res) => {
  res.send({ status: 'ok' })
})

app.post('/reserve', async (req, res) => {
  if (req.body) {
    let resultUser = await User.findOne({ _id: req.body.user_id })
    let resultDoc = await Doctor.findOne({ _id: req.body.doctor_id, 'slots.datetime': req.body.slot })
    resultDoc.slots.forEach(el => {
      if (el.datetime === req.body.slot && el.reservedBy !== null) {
        res.send('Это время уже занято')
        resultDoc = null
      }
    })
    if (resultUser && resultDoc) {
      const info = await Doctor.updateOne({ _id: req.body.doctor_id, 'slots.datetime': req.body.slot }, { $set: { 'slots.$.reservedBy': req.body.user_id } })
      res.send(info.nModified ? 'Вы успешно записались на приём' : 'Что-то пошло не так, попробуйте еще раз')

      const currentDate = Date.now()
      const appointmentDate = new Date(req.body.slot)
      console.log(new Date(appointmentDate - 2592000000).toLocaleString())
      if (info.nModified && currentDate + 86400000 < appointmentDate) {
        schedule.scheduleJob(appointmentDate - 2592000000 , () => {
          fs.appendFile('notifications.log', `${new Date(Date.now()).toLocaleString()} | Привет, ${resultUser.name}! Напоминаем что вы записаны к ${resultDoc.spec}у завтра в ${new Date(appointmentDate).toLocaleString().substr(12, 5)}!\n`, err => {
            if (err) console.log(err)
          })
        })
      }
      if (info.nModified && currentDate + 7200000 < appointmentDate) {
        schedule.scheduleJob(appointmentDate - 7200000, () => {
          fs.appendFile('notifications.log', `${new Date(Date.now()).toLocaleString()} | Привет, ${resultUser.name}! Вам через 2 часа к ${resultDoc.spec}у в ${new Date(appointmentDate).toLocaleString().substr(12, 5)}!\n`, err => {
            if (err) console.log(err)
          })
        })
      }
    }
  }
})
