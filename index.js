import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

import { addUser, updateUser } from './controllers/users'
import { addChannels, updateChannel, getChannels } from './controllers/channels'
import mailer from './services/mailer'

function _init(db) {
  const redditNotifier = db.db('reddit-notifier')
  const app = express()
  const port = 3000

  dotenv.config()

  app.use(bodyParser.json())
  app.listen(port, () => console.log(`Reddit Notifier listening on port: ${port}`))

  // Prevent dupplicate records
  redditNotifier.collection('users').createIndex({ user: 1 }, { unique: true })
  redditNotifier.collection('channels').createIndex({ userId: 1, name: 1 }, { unique: true })

  return {
    redditNotifier,
    app,
  }
}

MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true }, (err, db) => {

  const {redditNotifier, app} = _init(db)

  app.post('/users/:user', async (req, res) => {
    const user = req.params.user
    const { name, email } = req.body

    const result = await addUser(redditNotifier, { user, name, email })

    res.status(result.status).json({
      message: result.message
    })
  })

  app.put('/users/:user', async (req, res) => {
    const user = req.params.user
    const { active, email, name } = req.body

    const result = await updateUser(redditNotifier, { user, active, email, name })

    res.status(result.status).json({
      message: result.message
    })
  })

  app.post('/users/:user/channels/', async (req, res) => {
    const user = req.params.user
    const channels = req.body.channels

    const result = await addChannels(redditNotifier, user, channels)

    res.status(result.status).json({
      message: result.message,
      data: result.data
    })
  })

  app.get('/users/:user/channels', async (req, res) => {
    const result = await getChannels(redditNotifier, req.params.user)
    
    res.status(result.status).json({
      message: result.message,
      data: result.data
    })
  })

  app.put('/users/:user/channels/:channel', async (req, res) => {
    const update = { user: req.params.user, channel: req.params.channel, active: req.body.active }
    const result = await updateChannel(redditNotifier, update)
    
    res.status(result.status).json({
      message: result.message,
      data: result.data
    })
  })
})
