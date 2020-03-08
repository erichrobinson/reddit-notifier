import express from 'express'
import { MongoClient } from 'mongodb'
import { CronJob } from 'cron'
import axios from 'axios'
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

MongoClient.connect('mongodb://localhost:27017/', (err, db) => {

  dotenv.config()
  
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);




  // Basic reddit implementation
  // async function getPosts() {
  //   try {
  //     const response = await axios.get('https://reddit.com/r/nature/top.json?count=3');
  //     console.log(response.data.data.children);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // getPosts()

  // Basic cron functionality. Need to hook up to SendGrid API
  // get all active users
  // for each user => get channels
  // for each channel => get top posts
  // send data through sendgrids
  // var job = new CronJob('* * * * * *', function() {
  //   console.log('You will see this message every second');
  // }, null, true, 'America/Los_Angeles');
  // job.start();

  const redditNotifier = db.db('reddit-notifier')
  const app = express()
  const port = 3000

  app.listen(port, () => console.log(`Reddit Notifier listening on port: ${port}`))

  redditNotifier.collection('users').ensureIndex({ name: 1 }, { unique: true })

  app.post('/users/:user', async (req, res) => {
    const user = req.params.user
    const response = {}
    
    try {
      await redditNotifier.collection('users').insertOne({
        name: user,
        active: true
      })
      response.status = 200
      response.message = `Created user ${user}`
    }
    catch(err) {
      console.error(`Error creating user: ${err}`)
      response.status = 500
      response.message = err.message
    }

    res.status(response.status).json({
      'message': response.message,
    })
  })

  app.put('/users/:user', async (req, res) => {
    const user = req.params.user
    const active = (!req.query.active || req.query.active.toLowerCase() === 'true') ? true : false

    try {
      const update = await redditNotifier.collection('users').updateOne({ name: user }, { $set: { active } })
      console.log(update)
    }
    catch(err) {
      console.error(`Error updating user: ${user}. ${err}`)
    }

    res.sendStatus(200)
  })

  app.post('/users/:user/channels/:channel', async (req, res) => {
    const user = req.params.user
    const channel = req.params.channel

    try {
      const u = await redditNotifier.collection('users').findOne({ name: user })
      // handle not finding a user
      if(u) {
        await redditNotifier.collection('channels').insertOne({
          userId: u._id,
          name: channel,
          subscribed: true
        })
      }
    }
    catch(err) {
      console.error(`Error adding channel: ${channel} for user: ${user}`)
    }
  })

  app.get('/users/:user/channels', async (req, res) => {
    const user = req.params.user
    const u = await redditNotifier.collection('users').findOne({ name: user })
    const channels = await redditNotifier.collection('channels').find({ userId: u._id }).toArray()
    console.log('channels', channels)
    res.sendStatus(200)
  })
})
