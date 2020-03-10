import { CronJob } from 'cron'
import sendMail from './mailer'

export default async function scheduleEmails(db) {
  const users = await db.collection('users').find({ active: true })
  users.forEach(user => {
    sendMail(db, user)
    const job = new CronJob('0 8 * * * ', sendMail(db, user), null, true, 'America/Denver')
    job.start()
  })
}